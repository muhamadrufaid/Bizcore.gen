from rest_framework import viewsets, status, generics
from rest_framework.decorators import action
from django.core.exceptions import ValidationError
from rest_framework.response import Response
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models.functions import TruncMonth, TruncYear
from django.db import transaction
from django.conf import settings
from inflect import engine
from django.utils import timezone
from django.db import models
from decimal import Decimal
from django.db.models import Sum
from django.http import Http404
import logging

logger = logging.getLogger(__name__)

from .models import (
    Category, Product, Customer,
    DraftInvoice, DraftInvoiceItem,
    Invoice, InvoiceItem, Payment, Delivery,
    Vendor, Purchase, PurchaseItem, Staff, 
    InvoiceDelivery, BankAccountDetails, BrandDetails
)
from .serializers import (
    CategorySerializer, ProductSerializer, CustomerSerializer,
    DraftInvoiceSerializer, DraftInvoiceItemSerializer,
    InvoiceSerializer, InvoiceItemSerializer, PaymentSerializer,
    DeliverySerializer, VendorSerializer, PurchaseSerializer, PurchaseItemSerializer, StaffSerializer,
    InvoiceDeliverySerializer, BankAccountDetailsSerializer, BrandDetailsSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer


class CustomerViewSet(viewsets.ModelViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

# --------------------
# DRAFT INVOICE
# --------------------
class DraftInvoiceViewSet(viewsets.ModelViewSet):
    queryset = DraftInvoice.objects.all()
    serializer_class = DraftInvoiceSerializer

    def create(self, request, *args, **kwargs):
        # Extract the delivery data (if any) from the request
        delivery_data = request.data.get('delivery', None)
        # Remove delivery from the request data for the DraftInvoice serializer
        request.data.pop('delivery', None)

        # Pass the rest of the data to the DraftInvoice serializer
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        draft_invoice = serializer.save()
        
        # After saving the draft invoice, automatically calculate taxes for each item
        self.calculate_item_taxes(draft_invoice)

        # Calculate total for the draft invoice after item taxes have been calculated
        draft_invoice.calculate_totals()

        # If delivery data is provided, create the associated Delivery object
        if delivery_data:
            delivery_data['draft_invoice'] = draft_invoice  # Link delivery to the draft_invoice
            Delivery.objects.create(**delivery_data)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def calculate_item_taxes(self, draft_invoice):
        """Automatically calculate tax for each item in the draft invoice"""

        for item in draft_invoice.items.all():
            item.calculate_tax()  # Calculate input and output tax
            item.calculate_gst()  # Recalculate GST
            item.save()  # Save the item with updated tax information
            print(f"Item {item.id} taxes calculated")
    
    def update(self, request, *args, **kwargs):
        # Get the existing DraftInvoice
        instance = self.get_object()

       # Save the current gst_type and invoice_type before updating
        old_gst_type = instance.gst_type

        # Use the serializer to update the draft invoice
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_invoice = serializer.save()

        # Check if gst_type has been updated
        new_gst_type = request.data.get('gst_type', old_gst_type)

        if new_gst_type != old_gst_type:
            # If gst_type is updated, recalculate GST for all items
            for item in updated_invoice.items.all():
                item.calculate_gst()  # Recalculate the GST fields for each item
                item.save()  # Save the updated item

            # Handle the delivery update (if delivery data is provided)
        delivery_data = request.data.get('delivery', None)
        
        if delivery_data:
            # Check if dispatched_at and delivered_at are in the correct format or None
            if 'dispatched_at' in delivery_data and delivery_data['dispatched_at'] == "":
                delivery_data['dispatched_at'] = None  # Set to None if empty string

            if 'delivered_at' in delivery_data and delivery_data['delivered_at'] == "":
                delivery_data['delivered_at'] = None  # Set to None if empty string

            # Try to get the associated delivery object, or create it if it doesn't exist
            delivery = getattr(instance, 'delivery', None)

            if delivery:
                # If a delivery object exists, update it with the new data
                for key, value in delivery_data.items():
                    setattr(delivery, key, value)
                delivery.save()  # Save the updated delivery
            else:
                # If no existing delivery object, create a new one and link it to the draft_invoice
                delivery_data['draft_invoice'] = updated_invoice  # Attach to the updated draft_invoice
                Delivery.objects.create(**delivery_data)

        # Recalculate totals after item updates or deletions
        updated_invoice.calculate_totals()

        updated_invoice.save()  # Save the updated invoice

        # Return the updated draft invoice data
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], url_path='cancel', url_name='cancel_invoice')
    def cancel_invoice(self, request, *args, **kwargs):
        """Soft delete a draft invoice and its related items by marking as cancelled."""
        draft_invoice = self.get_object()  # Get the draft invoice instance

        # Update the status to 'cancelled' and set the cancellation time
        draft_invoice.invoice_status = 'cancelled'
        draft_invoice.save()  # Save the updated draft invoice

        # Optionally mark items as cancelled (if you want)
        for item in draft_invoice.items.all():
            item.save()

        # Optionally delete associated delivery if you want
        if hasattr(draft_invoice, 'delivery'):
            draft_invoice.delivery.delete()  # Delete the related delivery

        return Response({"detail": "Draft invoice and related items cancelled successfully."}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['delete'], url_path='delete-item/(?P<item_id>\d+)')
    def delete_item(self, request, *args, **kwargs):
        draft_invoice = self.get_object()  # Get the draft invoice instance
        item_id = kwargs['item_id']  # Get the item ID from the URL parameter

        try:
            item = draft_invoice.items.get(id=item_id)  # Find the item in the invoice
            item.delete()  # Delete the item from the database
            
            # Recalculate the totals after removing the item
            draft_invoice.calculate_totals()  # Recalculate invoice totals
            draft_invoice.save()  # Save the updated invoice

            return Response({"detail": "Item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        
        except Item.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'])
    def finalize(self, request, pk=None):
        try:
            # Start a transaction block
            with transaction.atomic():
                # Retrieve the draft invoice
                draft_invoice = self.get_object()

                # Check if the invoice is already finalized
                if draft_invoice.invoice_status == 'finalized':
                    return Response({"detail": "Invoice already finalized."}, status=status.HTTP_400_BAD_REQUEST)

                # Ensure totals are calculated for the draft invoice
                draft_invoice.calculate_totals()  # Calculate totals for all items
                draft_invoice.save()  # Save the updated totals in the draft invoice

                # Initialize totals for the invoice
                total_sub_total = 0
                total_gst = 0
                total_cgst = 0
                total_sgst = 0
                total_igst = 0
                total_input_tax = 0
                total_output_tax = 0
                total_payable_tax = 0
                total = 0
                grand_total = 0

                # Create the invoice data
                invoice_data = {
                    'customer': draft_invoice.customer,
                    'invoice_status': 'active',  # Mark invoice as active
                    'invoice_type': draft_invoice.invoice_type,
                    'gst_type': draft_invoice.gst_type,
                    'mode_of_supply': draft_invoice.mode_of_supply,
                    'transportation_mode': draft_invoice.transportation_mode,
                    'due_date': draft_invoice.due_date
                }

                # Create the new invoice
                invoice = Invoice.objects.create(**invoice_data)
                # Copy items from draft_invoice to invoice and sum totals
                for item in draft_invoice.items.all():
                    product = item.product

                    # Check stock availability for each item
                    if product.stock_quantity < item.quantity:
                        raise ValidationError(f"Not enough stock for product {product.name}.")
                    
                    # Decrease the stock for the product based on the quantity in the invoice item
                    product.stock_quantity -= item.quantity
                    product.save()  # Save the updated product stock

                    # Create the InvoiceItem for the new invoice
                    InvoiceItem.objects.create(
                        invoice=invoice,
                        product=item.product,
                        name=item.name,
                        hsn_sac=item.hsn_sac,
                        code=item.code,
                        rate=item.rate,
                        uom=item.uom,
                        quantity=item.quantity,
                        discount=item.discount,
                        special_discount=item.special_discount,
                        net_value=item.net_value,
                        gst_percentage=item.gst_percentage,
                        cgst_percentage=item.cgst_percentage,
                        igst_percentage=item.igst_percentage,
                        sgst_percentage=item.sgst_percentage,
                        gst_amount=item.gst_amount,
                        cgst_amount=item.cgst_amount,
                        sgst_amount=item.sgst_amount,
                        igst_amount=item.igst_amount,
                        item_total=item.item_total,
                        input_tax=item.input_tax,
                        output_tax=item.output_tax
                    )
                    
                    # Summing up totals for the invoice
                    total_sub_total += item.net_value
                    total_gst += item.gst_amount
                    total_cgst += item.cgst_amount
                    total_sgst += item.sgst_amount
                    total_igst += item.igst_amount
                    total_input_tax += item.input_tax
                    total_output_tax += item.output_tax
                    total += item.item_total

                # Calculate grand total and round off
                grand_total = round(total)
                round_off = grand_total - total

                total_payable_tax = total_output_tax - total_input_tax
            
                # Update totals on the final invoice
                invoice.sub_total = total_sub_total
                invoice.total_gst = total_gst
                invoice.total_cgst = total_cgst
                invoice.total_sgst = total_sgst
                invoice.total_igst = total_igst
                invoice.total_input_tax = total_input_tax
                invoice.total_output_tax = total_output_tax
                invoice.total_payable_tax = total_payable_tax
                invoice.total = total
                invoice.grand_total = grand_total
                invoice.round_off = round_off

                # Convert the grand total to words and update the invoice_value
                invoice.invoice_value = self.convert_total_to_words(grand_total)

                invoice.save()

                # Create the invoice delivery details based on the draft invoice
                if hasattr(draft_invoice, 'delivery') and draft_invoice.delivery:
                    InvoiceDelivery.objects.create(
                        invoice=invoice,
                        delivery_address=draft_invoice.delivery.delivery_address,
                        city=draft_invoice.delivery.city,
                        state=draft_invoice.delivery.state,
                        pincode=draft_invoice.delivery.pincode,
                        landmark=draft_invoice.delivery.landmark,
                        status=draft_invoice.delivery.status,
                        assigned_to=draft_invoice.delivery.assigned_to,
                        transporter_name=draft_invoice.delivery.transporter_name,
                        transporter_gst_in=draft_invoice.delivery.transporter_gst_in,
                        vehicle_number=draft_invoice.delivery.vehicle_number,
                        dispatched_at=draft_invoice.delivery.dispatched_at,
                        delivered_at=draft_invoice.delivery.delivered_at,
                        delivery_notes=draft_invoice.delivery.delivery_notes,
                    )

                # Mark the draft invoice as finalized
                draft_invoice.invoice_status = 'finalized'
                draft_invoice.save()

                # Return the finalized invoice data 
                return Response(InvoiceSerializer(invoice).data, status=status.HTTP_201_CREATED)

        except DraftInvoice.DoesNotExist:
            return Response({"detail": "Draft Invoice not found."}, status=status.HTTP_404_NOT_FOUND)

        except ValidationError as e:
            # Handle validation errors
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        except Exception as e:
            # Handle any other exceptions
            return Response({"detail": "Something went wrong."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def convert_total_to_words(self, amount):
        """
        Convert a numeric amount to words and append 'rupees only'.
        """
        p = engine()  # inflect engine instance
        words = p.number_to_words(amount, andword=", and").replace(", and", "").replace(",", "")
        
        # Fix for large numbers like crore and billion
        words = words.replace(" one hundred", "hundred").replace(" and", "")
        
        return f"{words} rupees only"

class DraftInvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = DraftInvoiceItem.objects.all()
    serializer_class = DraftInvoiceItemSerializer


class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

    def create(self, request, *args, **kwargs):
        # Extract the delivery data (if any) from the request
        delivery_data = request.data.get('delivery', None)
        # Remove delivery from the request data for the serializer
        request.data.pop('delivery', None)

        # Create the invoice using the provided data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        invoice = serializer.save()

        # After saving the invoice, automatically calculate taxes for each item
        self.calculate_item_taxes(invoice)

        # Calculate total for the draft invoice after item taxes have been calculated
        invoice.calculate_totals()

         # Handle items and reduce stock
        items_data = request.data.get('items', [])
        for item_data in items_data:
            product_id = item_data.get('product')
            quantity = item_data.get('quantity')

             # Fetch the Product object by its ID
            try:
                product = Product.objects.get(id=product_id)
            except Product.DoesNotExist:
                return Response({"detail": f"Product with ID {product_id} does not exist."}, status=status.HTTP_404_NOT_FOUND)

            # Ensure 'name' is present in item_data
            name = item_data.get('name')
            if not name:
                return Response({"detail": "Item name is required."}, status=status.HTTP_400_BAD_REQUEST)

            # Check if there is enough stock for the product
            if product.stock_quantity < quantity:
                return Response({"detail": f"Not enough stock for product {product.name}."}, status=status.HTTP_400_BAD_REQUEST)

            # Decrease the stock by the quantity being added to the invoice
            product.stock_quantity -= quantity
            product.save()

            # Create the invoice item and link it to the invoice
            InvoiceItem.objects.create(
                invoice=invoice,
                product=product,
                name=name,
                hsn_sac=item_data.get('hsn_sac', ''),
                code=item_data.get('code', ''),
                rate=item_data.get('rate', 0),
                uom=item_data.get('uom', ''),
                quantity=quantity,
                discount=item_data.get('discount', 0),
                special_discount=item_data.get('special_discount', 0),
                net_value=item_data.get('net_value', 0),
                gst_percentage=item_data.get('gst_percentage', 0),
                cgst_percentage=item_data.get('cgst_percentage', 0),
                igst_percentage=item_data.get('igst_percentage', 0),
                sgst_percentage=item_data.get('sgst_percentage', 0),
                gst_amount=item_data.get('gst_amount', 0),
                cgst_amount=item_data.get('cgst_amount', 0),
                sgst_amount=item_data.get('sgst_amount', 0),
                igst_amount=item_data.get('igst_amount', 0),
                input_tax=item_data.get('input_tax', 0),
                output_tax=item_data.get('output_tax', 0),
                item_total=item_data.get('item_total', 0)
            )

        # If delivery data is provided, create the associated Delivery object
        if delivery_data:
            delivery_data['invoice'] = invoice  # Link delivery to the draft_invoice
            InvoiceDelivery.objects.create(**delivery_data)

        # Handle payments if they are included in the request data
        payments_data = request.data.get('payments', [])
        if payments_data:
            for payment_data in payments_data:
                payment_serializer = PaymentSerializer(data=payment_data)
                payment_serializer.is_valid(raise_exception=True)
                payment_serializer.save(invoice=serializer.instance, customer=serializer.instance.customer)

        # Return the response with the newly created invoice data
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def calculate_item_taxes(self, draft_invoice):
        """Automatically calculate tax for each item in the draft invoice"""
        for item in draft_invoice.items.all():
            item.calculate_tax()  # Calculate input and output tax
            item.calculate_gst()  # Recalculate GST
            item.save()  # Save the item with updated tax information
            print(f"Item {item.id} taxes calculated")

    def update(self, request, *args, **kwargs):
        # Get the existing Invoice instance
        instance = self.get_object()

        # Save the current gst_type before updating the invoice
        old_gst_type = instance.gst_type
        
        # Use the serializer to update the invoice
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        updated_invoice = serializer.save()

         # Check if gst_type has been updated
        new_gst_type = request.data.get('gst_type', old_gst_type)

        if new_gst_type != old_gst_type:
            # If gst_type is updated, recalculate GST for all items
            for item in updated_invoice.items.all():
                item.calculate_gst()  # Recalculate the GST fields for each item
                item.save()  # Save the updated item

        # Start a database transaction
        try:
            with transaction.atomic():
                # Handle updated items (decrease stock for new items, increase for removed ones)
                new_items_data = request.data.get('items', [])
                existing_item_ids = [item.id for item in updated_invoice.items.all()]

                # Update items and stock quantity
                for item_data in new_items_data:
                    product_id = item_data.get('product')  # This is the product ID
                    quantity = item_data.get('quantity')

                    if not product_id:
                        return Response({"detail": "Product ID is missing."}, status=status.HTTP_400_BAD_REQUEST)

                    # Fetch the Product object by its ID
                    try:
                        product = Product.objects.get(id=product_id)
                    except Product.DoesNotExist:
                        return Response({"detail": f"Product with ID {product_id} does not exist."}, status=status.HTTP_404_NOT_FOUND)

                    # Check if it's an existing item
                    if 'id' in item_data:
                        item_id = item_data['id']
                        try:
                            item = InvoiceItem.objects.get(id=item_id)
                        except InvoiceItem.DoesNotExist:
                            continue  # If the item doesn't exist in the invoice, skip it
                        
                        # Check if the quantity or other fields have changed
                        if item.quantity != quantity or item.discount != item_data.get('discount', item.discount):
                            # Log the old quantity before making any changes
                            old_quantity = item.quantity
                            print(f"Item ID: {item.id}, Old Quantity: {old_quantity}, Updated Quantity: {quantity}")

                            # Calculate the quantity difference
                            quantity_difference = old_quantity - item.quantity

                            # Log the difference for debugging
                            print(f"Quantity Difference: {quantity_difference}, Available Stock: {product.stock_quantity}")

                            # If the quantity has changed, adjust stock accordingly
                            if quantity_difference != 0:
                                # Use a transaction to ensure data integrity
                                # If quantity has decreased, increase stock
                                if quantity_difference < 0:
                                    product.stock_quantity += abs(quantity_difference)  # Add the reduced quantity back to stock
                                    product.save()
                                    print(f"Stock Increased: {product.stock_quantity}")

                                # If quantity has increased, check stock and decrease stock accordingly
                                elif quantity_difference > 0:
                                    if product.stock_quantity < quantity_difference:
                                        print(f"Stock not enough: {product.stock_quantity} < {quantity_difference}")
                                        return Response({"detail": f"Not enough stock for product {product.name}."}, status=status.HTTP_400_BAD_REQUEST)

                                    product.stock_quantity -= quantity_difference  # Decrease the stock by the quantity difference
                                    product.save()
                                    print(f"Stock Decreased: {product.stock_quantity}")

                            # Update the item fields
                            item.name = item_data.get('name', item.name)  # Default to the current value if not present
                            item.quantity = quantity
                            item.discount = item_data.get('discount', item.discount)
                            item.special_discount = item_data.get('special_discount', item.special_discount)
                            item.net_value = item_data.get('net_value', item.net_value)
                            item.gst_percentage = item_data.get('gst_percentage', item.gst_percentage)
                            item.cgst_percentage = item_data.get('cgst_percentage', item.cgst_percentage)
                            item.igst_percentage = item_data.get('igst_percentage', item.igst_percentage)
                            item.sgst_percentage = item_data.get('sgst_percentage', item.sgst_percentage)
                            item.gst_amount = item_data.get('gst_amount', item.gst_amount)
                            item.cgst_amount = item_data.get('cgst_amount', item.cgst_amount)
                            item.sgst_amount = item_data.get('sgst_amount', item.sgst_amount)
                            item.igst_amount = item_data.get('igst_amount', item.igst_amount)
                            item.input_tax = item_data.get('input_tax', item.input_tax)
                            item.output_tax = item_data.get('output_tax', item.output_tax)
                            item.item_total = item_data.get('item_total', item.item_total)
                            # Recalculate the tax for the item after update
                            item.save()

                    else:
                        # New item, create the item and decrease stock
                        # Check if there is enough stock for the product
                        if product.stock_quantity < quantity:
                            return Response({"detail": f"Not enough stock for product {product.name}."}, status=status.HTTP_400_BAD_REQUEST)

                        product.stock_quantity -= quantity
                        product.save()

                        # Create the invoice item
                        InvoiceItem.objects.create(
                            invoice=updated_invoice,
                            product=product,
                            name=item_data.get('name', ''),
                            hsn_sac=item_data.get('hsn_sac', ''),
                            code=item_data.get('code', ''),
                            rate=item_data.get('rate', 0),
                            uom=item_data.get('uom', ''),
                            quantity=quantity,
                            discount=item_data.get('discount', 0),
                            special_discount=item_data.get('special_discount', 0),
                            net_value=item_data.get('net_value', 0),
                            gst_percentage=item_data.get('gst_percentage', 0),
                            cgst_percentage=item_data.get('cgst_percentage', 0),
                            igst_percentage=item_data.get('igst_percentage', 0),
                            sgst_percentage=item_data.get('sgst_percentage', 0),
                            gst_amount=item_data.get('gst_amount', 0),
                            cgst_amount=item_data.get('cgst_amount', 0),
                            sgst_amount=item_data.get('sgst_amount', 0),
                            igst_amount=item_data.get('igst_amount', 0),
                            input_tax=item_data.get('input_tax', 0),
                            output_tax=item_data.get('output_tax', 0),
                            item_total=item_data.get('item_total', 0)
                        )

                # Handle item deletions (return stock to products)
                deleted_item_ids = [item.id for item in instance.items.all() if item.id not in existing_item_ids]
                for item_id in deleted_item_ids:
                    item = instance.items.get(id=item_id)
                    product = item.product
                    product.stock_quantity += item.quantity  # Add back the quantity to stock
                    product.save()
                    item.delete()  # Delete the item from the invoice

                # Check if gst_type has been updated
                new_gst_type = request.data.get('gst_type', old_gst_type)

                # Recalculate GST for all items if gst_type has been updated
                if new_gst_type != old_gst_type:
                    for item in updated_invoice.items.all():
                        item.calculate_gst()  # Recalculate the GST fields for each item
                        item.save()  # Save the updated item

                    # Recalculate totals after updating the items
                    updated_invoice.calculate_totals()

                # Handle the delivery update (if delivery data is provided)
                delivery_data = request.data.get('delivery', None)

                if delivery_data:
                    # Try to get the associated delivery object, or create it if it doesn't exist
                    delivery = getattr(instance, 'delivery', None)

                    if delivery:
                        # If a delivery object exists, update it with the new data
                        for key, value in delivery_data.items():
                            setattr(delivery, key, value)
                        delivery.save()  # Save the updated delivery
                    else:
                        # If no existing delivery object, create a new one and link it to the draft_invoice
                        delivery_data['invoice'] = updated_invoice  # Attach to the updated draft_invoice
                        InvoiceDelivery.objects.create(**delivery_data)

                # Recalculate totals after item updates or deletions
                updated_invoice.calculate_totals()

                # Save the updated invoice
                updated_invoice.save()

                # Return the updated draft invoice data
                return Response(serializer.data)

        except Exception as e:
            # Rollback the transaction if anything fails
            transaction.rollback()
            return Response({"detail": f"Error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            # Rollback the transaction if anything else fails
            return Response({"detail": f"Error occurred: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

        
    @action(detail=True, methods=['delete'], url_path='delete-item/(?P<item_id>\d+)')
    def delete_item(self, request, *args, **kwargs):
        invoice = self.get_object()  # Get the draft invoice instance
        item_id = kwargs['item_id']  # Get the item ID from the URL parameter

        try:
            # Find the item in the invoice
            item = invoice.items.get(id=item_id)
            
            if not item:
                raise ValueError(f"Item with id {item_id} not found in this invoice.")

            # Access the product linked to this item
            product = item.product

            if not product:
                raise ValueError(f"Product associated with item id {item_id} not found.")

            # Return the item quantity to the product stock
            product.stock_quantity += item.quantity
            product.save()

            # Delete the item from the invoice
            item.delete()

            # Recalculate the totals after removing the item
            invoice.calculate_totals()  # Recalculate the invoice totals
            invoice.save()  # Save the updated invoice

            return Response({"detail": "Item deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

        except InvoiceItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)
        

    @action(detail=True, methods=['post'])
    def add_payment(self, request, pk=None):
        """Handle adding payments to an existing invoice."""
        invoice = self.get_object()
        payment_data = request.data

        # Validate and create payment
        payment_serializer = PaymentSerializer(data=payment_data)
        payment_serializer.is_valid(raise_exception=True)
        payment_serializer.save(invoice=invoice, customer=invoice.customer)

        # Recalculate the payment status after adding the payment
        invoice.calculate_payment_status()

        # Return the updated invoice data
        invoice_serializer = InvoiceSerializer(invoice)
        return Response(invoice_serializer.data, status=status.HTTP_200_OK)


class InvoiceItemViewSet(viewsets.ModelViewSet):
    queryset = InvoiceItem.objects.all()
    serializer_class = InvoiceItemSerializer

class InvoiceDeliveryViewSet(viewsets.ModelViewSet):
    queryset = InvoiceDelivery.objects.all()
    serializer_class = InvoiceDeliverySerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

    def get_queryset(self):
        # Get invoice_id from the URL parameters
        invoice_id = self.request.query_params.get('invoice', None)

        if invoice_id:
            # If invoice_id is provided, filter payments related to that invoice
            return Payment.objects.filter(invoice_id=invoice_id)
        else:
            # Otherwise return all payments
            return Payment.objects.all()

    def create(self, request, *args, **kwargs):
        try:
            # Extract payment data from the request
            payment_data = request.data
            invoice_id = payment_data.get('invoice')
            invoice = Invoice.objects.get(id=invoice_id)

            # Ensure we're working with Decimal values for precision
            grand_total = Decimal(invoice.grand_total)

            # Calculate the total paid so far (aggregate payments)
            total_paid = invoice.payments.aggregate(total_paid=Sum('amount_paid'))['total_paid'] or Decimal(0)
            

            # Calculate remaining balance (balance_due)
            remaining_balance = grand_total - total_paid

            # Update the balance_due in the payment data
            payment_data['balance_due'] = remaining_balance
            payment_data['bill_amount'] = grand_total

            # Proceed with saving the payment
            serializer = self.get_serializer(data=payment_data)
            serializer.is_valid(raise_exception=True)
            
            # Save the payment and update the payment status on the invoice
            payment = serializer.save()

            # Update invoice payment status
            payment.invoice.update_payment_status()

            # Return the payment data in the response
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Invoice.DoesNotExist:
            return Response({"error": "Invoice not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class DeleteAllPayments(APIView):
    def delete(self, request, *args, **kwargs):
        # Delete all payments
        Payment.objects.all().delete()
        return Response({"detail": "All payments have been deleted."}, status=status.HTTP_204_NO_CONTENT)
        
class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer

class VendorViewSet(viewsets.ModelViewSet):
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer

    def perform_create(self, serializer):
        """Custom create method to handle nested serializer data"""
        # You could also add additional logic for handling the creation
        serializer.save()

    @action(detail=True, methods=['delete'], url_path='delete-item/(?P<item_id>\d+)')
    def delete_item(self, request, *args, **kwargs):
        purchase = self.get_object()  # Get the purchase instance
          # Retrieve the item_id from the URL
        item_id = kwargs.get('item_id')
        
        if not item_id:
            return Response({"detail": "Item ID is missing."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Find the item in the purchase's related items
            item = purchase.items.get(id=item_id)
            
            # Delete the item
            item.delete()
            # Recalculate purchase totals after deleting the item
            purchase.save()
            return Response({"detail": "Item deleted successfully."}, status=status.HTTP_200_OK)
        
        except PurchaseItem.DoesNotExist:
            return Response({"detail": "Item not found."}, status=status.HTTP_404_NOT_FOUND)


    def perform_update(self, serializer):
        """Custom update method to handle nested serializer data"""
        # You could also add additional logic for handling the update
        serializer.save()


class PurchaseItemtViewSet(viewsets.ModelViewSet):
    queryset = PurchaseItem.objects.all()
    serializer_class = PurchaseItemSerializer

class StaffViewSet(viewsets.ModelViewSet):
    queryset = Staff.objects.all()
    serializer_class = StaffSerializer


class BankAccountDetailsViewSet(viewsets.ModelViewSet):
    queryset = BankAccountDetails.objects.all()
    serializer_class = BankAccountDetailsSerializer

    def perform_create(self, serializer):
        print(self.request.FILES)
        serializer.save()

    def perform_update(self, serializer):
        print(self.request.FILES)
        serializer.save()


class BrandDetailsViewSet(viewsets.ModelViewSet):
    queryset = BrandDetails.objects.all()
    serializer_class = BrandDetailsSerializer

class AlertsView(APIView):
    """
    View to get the alerts for products (low stock) and payments (due or overdue).
    """
    
    def get(self, request, *args, **kwargs):
        # Get all products
        products = Product.objects.all()
        alerts = []

        # Check for stock alerts
        for product in products:
            if product.stock_quantity < product.re_order_level:
                alerts.append({
                    "type": "stock_alert",
                    "message": f"Stock is low for {product.name}. Please reorder!",
                    "product_id": product.id,
                    "product_name": product.name,
                    "sku_code": product.sku_code,
                    "stock_quantity": product.stock_quantity
                })

        # Check for payment due alerts (overdue or due today)
        overdue_invoices = Invoice.objects.filter(due_date__lte=timezone.now().date())
        for invoice in overdue_invoices:
            # Find associated payments
            total_paid = invoice.payments.aggregate(total_paid=models.Sum('amount_paid'))['total_paid'] or 0
            remaining_balance = invoice.grand_total - total_paid
            
            if remaining_balance > 0:  # Only show alerts for invoices with unpaid balance
                alerts.append({
                    "type": "payment_alert",
                    "message": f"Payment for Invoice {invoice.invoice_number} (Customer: {invoice.customer.name}) is overdue. Grand Total: ₹{invoice.grand_total}. Remaining balance: ₹{remaining_balance}.",
                    "invoice_number": invoice.invoice_number,
                    "customer_name": invoice.customer.name,
                    "grand_total": invoice.grand_total,
                    "remaining_balance": remaining_balance,
                    "due_date": invoice.due_date
                })
        
        return Response({"alerts": alerts}, status=status.HTTP_200_OK)
    

class ProductCategoryStatsView(APIView):

    def get(self, request, *args, **kwargs):
        # Get all products
        total_products = Product.objects.count()
        active_products = Product.objects.filter(status='active').count()
        inactive_products = Product.objects.filter(status='inactive').count()
        out_of_stock_products = Product.objects.filter(status='out_of_stock').count()

        # Category statistics
        category_stats = {}
        categories = Category.objects.all()
        for category in categories:
            category_stats[category.name] = Product.objects.filter(category=category).count()

        # Prepare the response data
        data = {
            "total_products": total_products,
            "active_products": active_products,
            "inactive_products": inactive_products,
            "out_of_stock_products": out_of_stock_products,
            "category_stats": category_stats,
        }

        return Response(data, status=status.HTTP_200_OK)
    

class CustomerStatsView(APIView):

    def get(self, request, *args, **kwargs):
        # Get all products
        total_customers = Customer.objects.count()
        active_customers = Customer.objects.filter(status='active').count()
        inactive_customers = Customer.objects.filter(status='inactive').count()
        individual_customers = Customer.objects.filter(customer_type='individual').count()
        business_customers = Customer.objects.filter(customer_type='business').count()

        # Prepare the response data
        data = {
            "total_customers": total_customers,
            "active_customers": active_customers,
            "inactive_customers": inactive_customers,
            "individual_customers": individual_customers,
            "business_customers": business_customers,
        }

        return Response(data, status=status.HTTP_200_OK)

class VendorStatsView(APIView):

    def get(self, request, *args, **kwargs):
        # Get all vendors
        total_vendors = Vendor.objects.count()
        active_vendors = Vendor.objects.filter(status='active').count()
        inactive_vendors = Vendor.objects.filter(status='inactive').count()

        # Prepare the response data
        data = {
            "total_vendors": total_vendors,
            "active_vendors": active_vendors,
            "inactive_vendors": inactive_vendors,
        }

        return Response(data, status=status.HTTP_200_OK)

class DraftInvoiceStatsView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch draft invoices count and other stats

        total_drafts = DraftInvoice.objects.count()
        total_draft_invoices = DraftInvoice.objects.filter(invoice_status='draft').count()
        total_finalized_invoices = DraftInvoice.objects.filter(invoice_status='finalized').count()
        total_cancelled_invoices = DraftInvoice.objects.filter(invoice_status='cancelled').count()

        tax_status_unpaid = DraftInvoice.objects.filter(tax_status='unpaid').count()
        tax_status_paid = DraftInvoice.objects.filter(tax_status='paid').count()

        invoice_type_retailer = DraftInvoice.objects.filter(invoice_type='individual').count()
        invoice_type_wholesaler = DraftInvoice.objects.filter(invoice_type='business').count()

        mode_of_supply_direct = DraftInvoice.objects.filter(mode_of_supply='direct').count()
        mode_of_supply_delivery = DraftInvoice.objects.filter(mode_of_supply='delivery').count()

        transportation_mode_none = DraftInvoice.objects.filter(transportation_mode='none').count()
        transportation_mode_road = DraftInvoice.objects.filter(transportation_mode='road').count()
        transportation_mode_rail = DraftInvoice.objects.filter(transportation_mode='rail').count()
        transportation_mode_air = DraftInvoice.objects.filter(transportation_mode='air').count()

        gst_type_cgst_sgst = DraftInvoice.objects.filter(gst_type='cgst_sgst').count()
        gst_type_igst = DraftInvoice.objects.filter(gst_type='igst').count()

        data = {
            "total_drafts": total_drafts,
            "total_draft_invoices": total_draft_invoices,
            "total_finalized_invoices": total_finalized_invoices,
            "total_cancelled_invoices": total_cancelled_invoices,
            "tax_status_unpaid": tax_status_unpaid,
            "tax_status_paid": tax_status_paid,
            "invoice_type_retailer": invoice_type_retailer,
            "invoice_type_wholesaler": invoice_type_wholesaler,
            "mode_of_supply_direct": mode_of_supply_direct,
            "mode_of_supply_delivery": mode_of_supply_delivery,
            "transportation_mode_none": transportation_mode_none,
            "transportation_mode_road": transportation_mode_road,
            "transportation_mode_rail": transportation_mode_rail,
            "transportation_mode_air": transportation_mode_air,
            "gst_type_cgst_sgst": gst_type_cgst_sgst,
            "gst_type_igst": gst_type_igst,
        }

        return Response(data, status=status.HTTP_200_OK)

class InvoiceStatsView(APIView):
    def get(self, request, *args, **kwargs):
        # Fetch draft invoices count and other stats
        total_invoice = Invoice.objects.count()
        total_active_invoices = Invoice.objects.filter(invoice_status='active').count()
        total_returned_invoices = Invoice.objects.filter(invoice_status='returned').count()
        total_cancelled_invoices = Invoice.objects.filter(invoice_status='cancelled').count()

        tax_status_unpaid = Invoice.objects.filter(tax_status='unpaid').count()
        tax_status_paid = Invoice.objects.filter(tax_status='paid').count()

        payment_status_unpaid = Invoice.objects.filter(payment_status='unpaid').count()
        payment_status_paid = Invoice.objects.filter(payment_status='paid').count()
        payment_status_partial = Invoice.objects.filter(payment_status='partial').count()

        invoice_type_retailer = Invoice.objects.filter(invoice_type='individual').count()
        invoice_type_wholesaler = Invoice.objects.filter(invoice_type='business').count()

        mode_of_supply_direct = Invoice.objects.filter(mode_of_supply='direct').count()
        mode_of_supply_delivery = Invoice.objects.filter(mode_of_supply='delivery').count()

        transportation_mode_none = Invoice.objects.filter(transportation_mode='none').count()
        transportation_mode_road = Invoice.objects.filter(transportation_mode='road').count()
        transportation_mode_rail = Invoice.objects.filter(transportation_mode='rail').count()
        transportation_mode_air = Invoice.objects.filter(transportation_mode='air').count()

        gst_type_cgst_sgst = Invoice.objects.filter(gst_type='cgst_sgst').count()
        gst_type_igst = Invoice.objects.filter(gst_type='igst').count()

        # Aggregate sums for taxes
        tax_sums = Invoice.objects.aggregate(
            total_input_tax=Sum('total_input_tax'),
            total_output_tax=Sum('total_output_tax'),
            total_payable_tax=Sum('total_payable_tax')
        )

        # Prepare the response data with the aggregated tax sums
        data = {
            "total_invoice": total_invoice,
            "total_active_invoices": total_active_invoices,
            "total_returned_invoices": total_returned_invoices,
            "total_cancelled_invoices": total_cancelled_invoices,
            "tax_status_unpaid": tax_status_unpaid,
            "tax_status_paid": tax_status_paid,
            "invoice_type_retailer": invoice_type_retailer,
            "invoice_type_wholesaler": invoice_type_wholesaler,
            "mode_of_supply_direct": mode_of_supply_direct,
            "mode_of_supply_delivery": mode_of_supply_delivery,
            "transportation_mode_none": transportation_mode_none,
            "transportation_mode_road": transportation_mode_road,
            "transportation_mode_rail": transportation_mode_rail,
            "transportation_mode_air": transportation_mode_air,
            "gst_type_cgst_sgst": gst_type_cgst_sgst,
            "gst_type_igst": gst_type_igst,
            "payment_status_unpaid": payment_status_unpaid,
            "payment_status_paid": payment_status_paid,
            "payment_status_partial": payment_status_partial, 
            "total_input_tax": tax_sums['total_input_tax'] or 0.00,
            "total_output_tax": tax_sums['total_output_tax'] or 0.00,
            "total_payable_tax": tax_sums['total_payable_tax'] or 0.00,
        }

        return Response(data, status=status.HTTP_200_OK)


class TaxStatsView(APIView):
    def get(self, request, *args, **kwargs):
        # Sum of total_payable_tax for paid and unpaid invoices
        tax_status_paid_sum = Invoice.objects.filter(tax_status='paid').aggregate(Sum('total_payable_tax'))['total_payable_tax__sum'] or 0.0
        tax_status_unpaid_sum = Invoice.objects.filter(tax_status='unpaid').aggregate(Sum('total_payable_tax'))['total_payable_tax__sum'] or 0.0

        # Count of invoices with paid and unpaid tax status
        tax_status_paid_count = Invoice.objects.filter(tax_status='paid').count()
        tax_status_unpaid_count = Invoice.objects.filter(tax_status='unpaid').count()

        # Aggregate sums for taxes
        tax_sums = Invoice.objects.aggregate(
            total_input_tax=Sum('total_input_tax'),
            total_output_tax=Sum('total_output_tax'),
            total_payable_tax=Sum('total_payable_tax')
        )

        data = {
            "tax_status_paid": tax_status_paid_count,
            "tax_status_unpaid": tax_status_unpaid_count,
            "tax_status_paid_sum": tax_status_paid_sum,
            "tax_status_unpaid_sum": tax_status_unpaid_sum,
            "total_input_tax": tax_sums['total_input_tax'] or 0.00,
            "total_output_tax": tax_sums['total_output_tax'] or 0.00,
            "total_payable_tax": tax_sums['total_payable_tax'] or 0.00,
        }

        return Response(data, status=status.HTTP_200_OK)


class PaymentStateView(APIView):
    def get(self, request, *args, **kwargs):
        # Sum of grand_total by payment mode
        cash_total = Payment.objects.filter(payment_mode='cash').aggregate(Sum('bill_amount'))['bill_amount__sum'] or 0.0
        card_total = Payment.objects.filter(payment_mode='card').aggregate(Sum('bill_amount'))['bill_amount__sum'] or 0.0
        upi_total = Payment.objects.filter(payment_mode='upi').aggregate(Sum('bill_amount'))['bill_amount__sum'] or 0.0
        bank_total = Payment.objects.filter(payment_mode='bank').aggregate(Sum('bill_amount'))['bill_amount__sum'] or 0.0
        credit_total = Payment.objects.filter(payment_mode='credit').aggregate(Sum('bill_amount'))['bill_amount__sum'] or 0.0
        wallet_total = Payment.objects.filter(payment_mode='wallet').aggregate(Sum('bill_amount'))['bill_amount__sum'] or 0.0
        hybrid_total = Payment.objects.filter(payment_mode='hybrid').aggregate(Sum('bill_amount'))['bill_amount__sum'] or 0.0

        amount_paid_total = Payment.objects.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0.0
    
        payment_mode_cash = Payment.objects.filter(payment_mode='cash').count()
        payment_mode_card = Payment.objects.filter(payment_mode='card').count()
        payment_mode_upi = Payment.objects.filter(payment_mode='upi').count()
        payment_mode_bank = Payment.objects.filter(payment_mode='bank').count()
        payment_mode_credit = Payment.objects.filter(payment_mode='credit').count()
        payment_mode_wallet = Payment.objects.filter(payment_mode='wallet').count()
        payment_mode_hybrid = Payment.objects.filter(payment_mode='hybrid').count()
       
        payment_status_unpaid = Payment.objects.filter(payment_status='unpaid').count()
        payment_status_paid = Payment.objects.filter(payment_status='paid').count()
        payment_status_partial = Payment.objects.filter(payment_status='partial').count()
        payment_status_reversed = Payment.objects.filter(payment_status='reversed').count()
        payment_status_failed = Payment.objects.filter(payment_status='failed').count()

        # Sum of balance_due by payment status
        paid_total = Payment.objects.filter(payment_status='paid').aggregate(Sum('balance_due'))['balance_due__sum'] or 0.0
        unpaid_total = Payment.objects.filter(payment_status='unpaid').aggregate(Sum('balance_due'))['balance_due__sum'] or 0.0
        partial_total = Payment.objects.filter(payment_status='partial').aggregate(Sum('balance_due'))['balance_due__sum'] or 0.0
        reversed_total = Payment.objects.filter(payment_status='reversed').aggregate(Sum('balance_due'))['balance_due__sum'] or 0.0
        failed_total = Payment.objects.filter(payment_status='failed').aggregate(Sum('balance_due'))['balance_due__sum'] or 0.0

        data = {
            "payment_status_unpaid": payment_status_unpaid,
            "payment_status_paid": payment_status_paid,
            "payment_status_partial": payment_status_partial,
            "payment_status_reversed": payment_status_reversed,
            "payment_status_failed": payment_status_failed,

            "payment_mode_cash": payment_mode_cash,
            "payment_mode_card": payment_mode_card,
            "payment_mode_upi": payment_mode_upi,
            "payment_mode_bank": payment_mode_bank,
            "payment_mode_wallet": payment_mode_wallet,
            "payment_mode_hybrid": payment_mode_hybrid,
            "payment_mode_credit": payment_mode_credit,

            "amount_paid_total": amount_paid_total,

            "cash_total": cash_total,
            "card_total": card_total,
            "upi_total": upi_total,
            "bank_total": bank_total,
            "credit_total": credit_total,
            "wallet_total": wallet_total,
            "hybrid_total": hybrid_total,

            "paid_total": paid_total,
            "unpaid_total": unpaid_total,
            "partial_total": partial_total,
            "reversed_total": reversed_total,
            "failed_total": failed_total,
           
        }

        return Response(data, status=status.HTTP_200_OK)


class PurchaseStateView(APIView):
    def get(self, request, *args, **kwargs):
        # Sum of grand_total, amount_paid, and balance_due for all purchases
        grand_total_sum = Purchase.objects.aggregate(Sum('grand_total'))['grand_total__sum'] or 0.0
        amount_paid_sum = Purchase.objects.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0.0
        balance_due_sum = Purchase.objects.aggregate(Sum('balance_due'))['balance_due__sum'] or 0.0

        # Breakdown of purchase status
        pending_count = Purchase.objects.filter(status='pending').count()
        partial_count = Purchase.objects.filter(status='partial').count()
        paid_count = Purchase.objects.filter(status='paid').count()

        data = {
            "pending_count": pending_count,
            "partial_count": partial_count,
            "paid_count": paid_count,
            "grand_total_sum": grand_total_sum,
            "amount_paid_sum": amount_paid_sum,
            "balance_due_sum": balance_due_sum,
            }
        return Response(data, status=status.HTTP_200_OK)

class AllOverViewStatsView(APIView):
    def get(self, request, *args, **kwargs):
        # Total invoice count
        total_invoice_count = Invoice.objects.count()

        # Total Purchase Amount (sum of all grand total in Purchase model)
        total_purchase_amount = Purchase.objects.aggregate(Sum('grand_total'))['grand_total__sum'] or 0.0

        # Total Sales Amount (sum of all grand total in Invoice model)
        total_sales_amount = Invoice.objects.aggregate(Sum('grand_total'))['grand_total__sum'] or 0.0

        # Total customer count
        total_customer_count = Customer.objects.count()

        # Total vendor count
        total_vendor_count = Vendor.objects.count()

        # Total product count
        total_product_count = Product.objects.count()

        # Tax Paid Total (Invoices where tax_status is 'paid')
        tax_paid_total = Invoice.objects.filter(tax_status='paid').aggregate(Sum('total_payable_tax'))['total_payable_tax__sum'] or 0.0

        # Tax Unpaid Total (Invoices where tax_status is 'unpaid')
        tax_unpaid_total = Invoice.objects.filter(tax_status='unpaid').aggregate(Sum('total_payable_tax'))['total_payable_tax__sum'] or 0.0

        # Total Payable Tax from all invoices
        total_payable_tax = Invoice.objects.aggregate(Sum('total_payable_tax'))['total_payable_tax__sum'] or 0.0

        # Interstate Total Count (Invoices where gst_type is 'igst')
        interstate_total_count = Invoice.objects.filter(gst_type='igst').count()

        # Intrastate Total Count (Invoices where gst_type is 'cgst_sgst')
        intrastate_total_count = Invoice.objects.filter(gst_type='cgst_sgst').count()

        # Total Purchase Amount Paid (sum of all amount_paid in Purchase model)
        total_purchase_amount_paid = Purchase.objects.aggregate(Sum('amount_paid'))['amount_paid__sum'] or 0.0

        # Total Purchase Balance Due (sum of all balance_due in Purchase model)
        total_purchase_balance_due = Purchase.objects.aggregate(Sum('balance_due'))['balance_due__sum'] or 0.0

        # Preparing the response data
        data = {
            "total_invoice_count": total_invoice_count,
            "total_purchase_amount": total_purchase_amount,
            "total_sales_amount": total_sales_amount,
            "total_customer_count": total_customer_count,
            "total_vendor_count": total_vendor_count,
            "total_product_count": total_product_count,
            "tax_paid_total": tax_paid_total,
            "tax_unpaid_total": tax_unpaid_total,
            "total_payable_tax": total_payable_tax,
            "interstate_total_count": interstate_total_count,
            "intrastate_total_count": intrastate_total_count,
            "total_purchase_amount_paid": total_purchase_amount_paid,
            "total_purchase_balance_due": total_purchase_balance_due,
        }

        return Response(data, status=status.HTTP_200_OK)