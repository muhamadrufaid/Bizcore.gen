from rest_framework import serializers
from django.db import transaction
from decimal import Decimal
from rest_framework.exceptions import ValidationError
import inflect
from .models import (
    Category, Product, Customer,
    DraftInvoice, DraftInvoiceItem,
    Invoice, InvoiceItem, Payment, Delivery,
    Vendor, Purchase, PurchaseItem,
    Staff , InvoiceDelivery, BankAccountDetails, BrandDetails
) 
from django.db import models
from django.db.models import Sum

# --------------------
# CATEGORY & PRODUCT
# --------------------
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = "__all__"

# --------------------
# CUSTOMER
# --------------------
class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = "__all__"

# --------------------
# DRAFT INVOICE
# --------------------
class DraftInvoiceItemSerializer(serializers.ModelSerializer):
    draft_invoice = serializers.PrimaryKeyRelatedField(queryset=DraftInvoice.objects.all(), required=False)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    product_name = serializers.CharField(source='product.name', read_only=True)

    # No need to make these fields required, they will be auto-populated
    name = serializers.CharField(read_only=True)
    code = serializers.CharField(read_only=True)
    hsn_sac = serializers.CharField(read_only=True)
    rate = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    uom = serializers.CharField(read_only=True)

    class Meta:
        model = DraftInvoiceItem
        fields = "__all__"  # Include all fields including read-only ones like name, code, rate, etc.

    def validate(self, data):
        """
        Ensure the required fields (name, code, hsn_sac, rate, uom) are populated from the product.
        """
        product = Product.objects.get(id=data['product'].id)
        
        if not data.get('product'):
            raise serializers.ValidationError("Product is required.")
    
        # Populate the missing fields from the product
        data['name'] = product.name
        data['code'] = product.sku_code
        data['hsn_sac'] = product.hsn_sac_code
        data['rate'] = product.retail_price
        data['uom'] = product.unit_of_measurement
        data['discount'] = product.discount

        # Calculate net_value: (rate * quantity) - (discount * quantity)  - special_discount
        net_value = (data['quantity'] * data['rate']) - (data['quantity'] * data.get('discount', 0)) - data.get('special_discount', 0)
        
        # Ensure net_value is not negative
        if net_value < 0:
            net_value = Decimal("0.00")
        
        data['net_value'] = net_value
        
        # Get GST percentage from product
        gst_percentage = Decimal(product.gst_rate or "0.00")
        data['gst_percentage'] = gst_percentage
        
        # Calculate GST and update fields based on gst_type
        gst_amount, cgst_amount, sgst_amount, igst_amount, item_total = self.calculate_gst(
            net_value, product, data.get('gst_type', 'cgst_sgst'), gst_percentage
        )

        # Update the values in the item data
        data['gst_amount'] = gst_amount
        data['cgst_amount'] = cgst_amount
        data['sgst_amount'] = sgst_amount
        data['igst_amount'] = igst_amount
        data['item_total'] = item_total

        return data

    def calculate_gst(self, net_value, product, gst_type, gst_percentage):
        """
        Helper method to calculate GST, CGST, SGST, IGST, and item total.
        """
        # Calculate GST amount based on net_value and gst_percentage
        gst_amount = net_value * (gst_percentage / Decimal("100"))

        # Initialize amounts
        cgst_amount = sgst_amount = igst_amount = Decimal("0.00")

        if gst_type == "cgst_sgst":
            # For CGST + SGST, distribute GST between CGST and SGST
            cgst_amount = gst_amount / Decimal("2")
            sgst_amount = gst_amount / Decimal("2")
            igst_amount = Decimal("0.00")  # Explicitly set IGST to 0

        elif gst_type == "igst":
            # For IGST, assign the full GST to IGST and set CGST, SGST to 0
            igst_amount = gst_amount
            cgst_amount = Decimal("0.00")
            sgst_amount = Decimal("0.00")

        # Calculate item total = net_value + gst_amount
        item_total = net_value + gst_amount

        return gst_amount, cgst_amount, sgst_amount, igst_amount, item_total

class DraftInvoiceSerializer(serializers.ModelSerializer):
    items = DraftInvoiceItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_address = serializers.CharField(source='customer.billing_address', read_only=True)
    customer_city = serializers.CharField(source='customer.city', read_only=True)
    customer_pincode = serializers.CharField(source='customer.pincode', read_only=True)
    phone_number = serializers.CharField(source='customer.phone', read_only=True)
    gst_in = serializers.CharField(source='customer.gst_number', read_only=True)
    state = serializers.CharField(source='customer.state', read_only=True)
    delivery = serializers.SerializerMethodField(required=False, allow_null=True)

    class Meta:
        model = DraftInvoice
        fields = "__all__"
    

    def get_delivery(self, obj):
        try:
            # Check if the DraftInvoice has an associated delivery and return serialized data
            return DeliverySerializer(obj.delivery).data
        except Delivery.DoesNotExist:
            # If no delivery is associated, return None
            return None

    def create(self, validated_data):
        # Extract the items and delivery data from validated data
        items_data = validated_data.pop('items')
        delivery_data = validated_data.pop('delivery', None)  # Get delivery data if provided

        # Create the DraftInvoice instance
        draft_invoice = DraftInvoice.objects.create(**validated_data)

        # Handle the delivery if provided
        if delivery_data:
            delivery_data['draft_invoice'] = draft_invoice  # Link the delivery to the draft_invoice
            Delivery.objects.create(**delivery_data)

        # Track products already in the invoice (existing products by their IDs)
        existing_products = {}

        # Create the associated DraftInvoiceItem objects
        for item_data in items_data:
            product = item_data.get('product')

            # Check if the product is already in the draft_invoice
            if product.id in existing_products:
                raise ValidationError(f"The product '{product.name}' is already added to this invoice.")

            # Add the product to the existing_products dictionary
            existing_products[product.id] = True

            # Create a new item
            item_data['draft_invoice'] = draft_invoice
            DraftInvoiceItem.objects.create(**item_data)

        # Calculate totals and set invoice_value
        draft_invoice.calculate_totals()

        draft_invoice.invoice_value = self.convert_invoice_value_to_words(draft_invoice.grand_total)

        draft_invoice.save()

        return draft_invoice

    def update(self, instance, validated_data):
        # Extract items and delivery data from validated data
        items_data = validated_data.pop('items', [])
        delivery_data = validated_data.pop('delivery', None)  # Handle delivery if mode_of_supply is 'delivery'


        # Update the DraftInvoice instance fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # Now, update or create associated DraftInvoiceItem objects
        for item_data in items_data:
            product = item_data.get('product')

            # Check if the item is marked for deletion
            if item_data.get('deleted', False):
                # Find the item to delete
                item_to_delete = DraftInvoiceItem.objects.filter(draft_invoice=instance, product=product).first()
                if item_to_delete:
                    item_to_delete.delete()  # Delete the item
                    continue  # Skip this item in further processing

            # If item doesn't need deletion, update or create as usual
            existing_item = DraftInvoiceItem.objects.filter(draft_invoice=instance, product=product).first()

            if existing_item:
                # Update the existing item
                existing_item.quantity = item_data.get('quantity', existing_item.quantity)
                existing_item.special_discount = item_data.get('special_discount', existing_item.special_discount)
                
                # Recalculate item details
                existing_item.calculate_gst()
                existing_item.calculate_tax()
                existing_item.save()
            else:
                # If item doesn't exist, create a new one
                item_data['draft_invoice'] = instance
                new_item = DraftInvoiceItem.objects.create(**item_data)
                new_item.calculate_gst()  # Recalculate the GST for the newly added item
                new_item.calculate_tax()
                new_item.save()

            # Initialize delivery to None
            if instance.mode_of_supply == "delivery" and delivery_data:
                delivery = instance.delivery  # Existing delivery linked to this invoice

                if delivery:
                    # Update the existing delivery
                    for attr, value in delivery_data.items():
                        setattr(delivery, attr, value)
                    delivery.save()
                else:
                    # Create new delivery if it does not exist
                    delivery_data['draft_invoice'] = instance  # Attach the draft_invoice to the new delivery
                    Delivery.objects.create(**delivery_data)

        # Recalculate totals after item updates or deletions
        instance.calculate_totals()
        instance.invoice_value = self.convert_invoice_value_to_words(instance.grand_total)

        instance.save()
        return instance
     
    def convert_invoice_value_to_words(self, amount):
        """
        Convert the total amount to words and return it as 'rupees only'
        """
        p = inflect.engine()
        words = p.number_to_words(amount).replace(", and", "").replace(",", "")
        return f"{words} rupees only"

# --------------------
# FINAL INVOICE
# --------------------
class InvoiceItemSerializer(serializers.ModelSerializer):

    invoice = serializers.PrimaryKeyRelatedField(queryset=Invoice.objects.all(), required=False)
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False)
    # No need to make these fields required, they will be auto-populated
    name = serializers.CharField(read_only=True)
    code = serializers.CharField(read_only=True)
    hsn_sac = serializers.CharField(read_only=True)
    rate = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    uom = serializers.CharField(read_only=True)
    net_value = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = InvoiceItem
        fields = "__all__"

    def validate(self, data):
        """
        Ensure the required fields (name, code, hsn_sac, rate, uom) are populated from the product.
        """
        # Fetch the product details based on the product ID
        product = Product.objects.get(id=data['product'].id)

        # Populate the missing fields from the product
        data['name'] = product.name
        data['code'] = product.sku_code
        data['hsn_sac'] = product.hsn_sac_code
        data['rate'] = product.retail_price  # Or choose the appropriate price
        data['uom'] = product.unit_of_measurement
        data['discount'] = product.discount

        # Calculate net_value: (rate * quantity) - (discount * quantity)  - special_discount
        net_value = (data['quantity'] * product.retail_price) - (data['quantity'] * data.get('discount', 0)) - data.get('special_discount', 0)
        
        # Ensure net_value is not negative
        if net_value < 0:
            net_value = Decimal("0.00")
        
        data['net_value'] = net_value
        
        # Get GST percentage from product
        gst_percentage = Decimal(product.gst_rate or "0.00")
        data['gst_percentage'] = gst_percentage
        
        # Calculate GST and update fields based on gst_type
        gst_amount, cgst_amount, sgst_amount, igst_amount, item_total = self.calculate_gst(
            net_value, product, data.get('gst_type', 'cgst_sgst'), gst_percentage
        )

        # Update the values in the item data
        data['gst_amount'] = gst_amount
        data['cgst_amount'] = cgst_amount
        data['sgst_amount'] = sgst_amount
        data['igst_amount'] = igst_amount
        data['item_total'] = item_total

        return data

    def calculate_gst(self, net_value, product, gst_type, gst_percentage):
        """
        Helper method to calculate GST, CGST, SGST, IGST, and item total.
        """
        # Calculate GST amount based on net_value and gst_percentage
        gst_amount = net_value * (gst_percentage / Decimal("100"))

        # Initialize amounts
        cgst_amount = sgst_amount = igst_amount = Decimal("0.00")

        if gst_type == "cgst_sgst":
            # For CGST + SGST, distribute GST between CGST and SGST
            cgst_amount = gst_amount / Decimal("2")
            sgst_amount = gst_amount / Decimal("2")
            igst_amount = Decimal("0.00")  # Explicitly set IGST to 0

        elif gst_type == "igst":
            # For IGST, assign the full GST to IGST and set CGST, SGST to 0
            igst_amount = gst_amount
            cgst_amount = Decimal("0.00")
            sgst_amount = Decimal("0.00")

        # Calculate item total = net_value + gst_amount
        item_total = net_value + gst_amount

        return gst_amount, cgst_amount, sgst_amount, igst_amount, item_total

class PaymentSerializer(serializers.ModelSerializer):
    remaining_balance = serializers.SerializerMethodField()  # Adding the remaining balance field
    customer_name = serializers.CharField(source='customer.name', read_only=True)  # Get customer name
    invoice_number = serializers.CharField(source='invoice.invoice_number', read_only=True)  # Get invoice number
    
    class Meta:
        model = Payment
        fields = "__all__"

    def create(self, validated_data):
        # Check if 'payment_mode' is 'hybrid' and calculate the 'amount_paid'
        payment_mode = validated_data.get('payment_mode')

        if payment_mode == 'hybrid':
            cash_amount = validated_data.get('cash_amount', Decimal(0))
            online_amount = validated_data.get('online_amount', Decimal(0))
            validated_data['amount_paid'] = cash_amount + online_amount

        # Create payment instance
        payment = super().create(validated_data)

        # Update invoice payment status
        payment.invoice.update_payment_status()

        return payment
    
    def get_remaining_balance(self, obj):
        # Get the associated invoice from the payment object
        invoice = obj.invoice

        # Calculate the total paid so far (aggregate payments)
        total_paid = invoice.payments.aggregate(total_paid=Sum('amount_paid'))['total_paid'] or Decimal(0)

        # Calculate the remaining balance (grand_total - total_paid)
        remaining_balance = invoice.grand_total - total_paid

        # Return the remaining balance
        return float(remaining_balance)
    
    def validate(self, data):
        # Retrieve the invoice associated with the payment
        invoice = data.get('invoice')
        amount_paid = data.get('amount_paid')

        # Convert to Decimal to avoid TypeError in comparison
        amount_paid = Decimal(amount_paid)

         # Ensure grand_total exists (not None)
        grand_total = invoice.grand_total if invoice.grand_total is not None else Decimal(0)

        if grand_total == 0:
            raise ValidationError("Invoice total cannot be zero.")

        # Calculate total amount paid so far for this invoice
        total_paid = invoice.payments.aggregate(total_paid=models.Sum('amount_paid'))['total_paid'] or Decimal(0)
        
        # Calculate the remaining balance due
        balance_due = invoice.grand_total - total_paid


        # If the amount_paid exceeds the grand_total
        if amount_paid > grand_total:
            # Calculate the excess amount
            excess_amount = invoice.grand_total - total_paid 
            raise ValidationError(f"The total amount paid cannot be greater than {invoice.grand_total}. You have only {balance_due:.2f} left to pay.")

        # If the payment is greater than the remaining balance
        if amount_paid > balance_due:
            raise ValidationError(f"The total amount paid cannot be greater than {invoice.grand_total}. You have only {balance_due:.2f} left to pay.")
        
        return data

class InvoiceSerializer(serializers.ModelSerializer):
    items = InvoiceItemSerializer(many=True)
    customer_name = serializers.CharField(source='customer.name', read_only=True)
    customer_address = serializers.CharField(source='customer.billing_address', read_only=True)
    customer_city = serializers.CharField(source='customer.city', read_only=True)
    customer_pincode = serializers.CharField(source='customer.pincode', read_only=True)
    phone_number = serializers.CharField(source='customer.phone', read_only=True)
    gst_in = serializers.CharField(source='customer.gst_number', read_only=True)
    state = serializers.CharField(source='customer.state', read_only=True)
    delivery = serializers.SerializerMethodField(required=False, allow_null=True)
    payments = PaymentSerializer(many=True, required=False)
    remaining_balance = serializers.SerializerMethodField()  # Add the remaining balance field
    class Meta:
        model = Invoice
        fields = "__all__"


    def get_remaining_balance(self, obj):
        # Calculate total paid from associated payments
        total_paid = obj.payments.aggregate(total_paid=Sum('amount_paid'))['total_paid'] or Decimal(0)
        # Calculate remaining balance
        remaining_balance = obj.grand_total - total_paid
        # Return the remaining balance as a float for consistency
        return float(remaining_balance)
    
    def get_delivery(self, obj):
        try:
            # Check if the DraftInvoice has an associated delivery and return serialized data
            return InvoiceDeliverySerializer(obj.delivery).data
        except InvoiceDelivery.DoesNotExist:
            # If no delivery is associated, return None
            return None

    def create(self, validated_data):
        # Extract the items data from validated data
        items_data = validated_data.pop('items')
        delivery_data = validated_data.pop('delivery', None)  # Get delivery data if provided
        payments_data = validated_data.pop('payments', [])
       
        # Start a transaction
        try:
            with transaction.atomic():
                # Create the Invoice instance
                invoice = Invoice.objects.create(**validated_data)

                # Handle Delivery
                if delivery_data:
                    delivery_data['invoice'] = invoice
                    InvoiceDelivery.objects.create(**delivery_data)

                # Track products already in the invoice
                existing_products = {}

                # Create the associated InvoiceItem objects
                for item_data in items_data:
                    product = item_data.get('product')

                    # Check if the product is already in the invoice
                    if product.id in existing_products:
                        raise ValidationError(f"The product '{product.name}' is already added to this invoice.")

                    # Add the product to the existing_products dictionary
                    existing_products[product.id] = True

                    # Check if there's enough stock
                    if product.stock_quantity < item_data.get('quantity', 0):
                        raise ValidationError(f"Not enough stock for product {product.name}.")

                    product.stock_quantity -= item_data.get('quantity', 0)
                    product.save()

                    # Create the InvoiceItem
                    item_data['invoice'] = invoice
                    InvoiceItem.objects.create(**item_data)

                # Handle Payments
                for payment_data in payments_data:
                    payment_data['invoice'] = invoice
                    Payment.objects.create(**payment_data)

                # Update payment status and totals
                invoice.update_payment_status()
                invoice.calculate_totals()
                invoice.invoice_value = self.convert_invoice_value_to_words(invoice.grand_total)
                invoice.save()

                return invoice

        except Exception as e:
            # Rollback transaction if an error occurs
            raise ValidationError(f"Failed to create invoice: {str(e)}")
    
    def update(self, instance, validated_data):
        items_data = validated_data.pop('items', [])
        delivery_data = validated_data.pop('delivery', None)

        # Start a transaction
        try:
            with transaction.atomic():
                # Update the invoice instance fields
                for attr, value in validated_data.items():
                    setattr(instance, attr, value)

                # Update or create associated InvoiceItem objects
                for item_data in items_data:
                    product = item_data.get('product')

                    # Check if the item is marked for deletion
                    if item_data.get('deleted', False):
                        item_to_delete = InvoiceItem.objects.filter(invoice=instance, product=product).first()
                        if item_to_delete:
                            # Revert stock before deletion
                            item_to_delete.product.stock_quantity += item_to_delete.quantity
                            item_to_delete.product.save()
                            item_to_delete.delete()
                        continue  # Skip this item in further processing

                    existing_item = InvoiceItem.objects.filter(invoice=instance, product=product).first()

                    if existing_item:
                        # Update the existing item
                        old_quantity = existing_item.quantity
                        new_quantity = item_data.get('quantity', old_quantity)
                        quantity_difference = new_quantity - old_quantity

                        # Adjust stock for the quantity change
                        if quantity_difference != 0:
                            if quantity_difference > 0:
                                # Decrease stock for increased quantity
                                if product.stock_quantity < quantity_difference:
                                    raise ValidationError(f"Not enough stock for product {product.name}.")
                                product.stock_quantity -= quantity_difference
                                product.save()
                            else:
                                # Increase stock for decreased quantity
                                product.stock_quantity += abs(quantity_difference)
                                product.save()

                        # Update item details
                        existing_item.quantity = new_quantity
                        existing_item.special_discount = item_data.get('special_discount', existing_item.special_discount)
                        existing_item.calculate_gst()
                        existing_item.calculate_tax()
                        existing_item.save()
                    else:
                        # If it's a new item, check stock and create it
                        if product.stock_quantity < item_data.get('quantity', 0):
                            raise ValidationError(f"Not enough stock for product {product.name}.")

                        product.stock_quantity -= item_data.get('quantity', 0)
                        product.save()

                        item_data['invoice'] = instance
                        new_item = InvoiceItem.objects.create(**item_data)
                        new_item.calculate_gst()  # Recalculate the GST for the newly added item
                        new_item.calculate_tax()
                        new_item.save()

                # Handle Delivery update if necessary
                if instance.mode_of_supply == "delivery" and delivery_data:
                    delivery = instance.delivery  # Existing delivery linked to this invoice
                    if delivery:
                        for attr, value in delivery_data.items():
                            setattr(delivery, attr, value)
                        delivery.save()
                    else:
                        delivery_data['invoice'] = instance  # Attach to the new invoice
                        InvoiceDelivery.objects.create(**delivery_data)

                # Update payment status based on total paid and grand total
                total_paid = instance.payments.aggregate(total_paid=Sum('amount_paid'))['total_paid'] or 0
                if total_paid >= instance.grand_total:
                    instance.payment_status = 'paid'
                elif total_paid > 0:
                    instance.payment_status = 'partially paid'
                else:
                    instance.payment_status = 'unpaid'

                # Recalculate totals after item updates or deletions
                instance.calculate_totals()

                # Convert grand total to words
                instance.invoice_value = self.convert_invoice_value_to_words(instance.grand_total)

                instance.save()

                return instance

        except Exception as e:
            # Rollback transaction if any error occurs
            raise ValidationError(f"Failed to update invoice: {str(e)}")

    def convert_invoice_value_to_words(self, amount):
        """
        Convert the total amount to words and return it as 'rupees only'
        """
        p = inflect.engine()
        words = p.number_to_words(amount).replace(", and", "").replace(",", "")
        return f"{words} rupees only"

class DeliverySerializer(serializers.ModelSerializer):
    class Meta:
        model = Delivery
        fields = "__all__"
        
        
class VendorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendor
        fields = "__all__"
        

class PurchaseItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    purchase = serializers.PrimaryKeyRelatedField(queryset=Purchase.objects.all(), required=False)
    product_name = serializers.CharField(source='product.name', read_only=True)

    class Meta:
        model = PurchaseItem
        fields = '__all__'
        
    def validate(self, data):
        # No auto-calculation, just validation if required fields are provided
        quantity = data.get('quantity', 0)
        if quantity <= 0:
            raise serializers.ValidationError("Quantity must be greater than zero.")
        # Validate other fields like total_cost, gst_percentage, etc. if necessary
        return data

class PurchaseSerializer(serializers.ModelSerializer):
    items = PurchaseItemSerializer(many=True)
    vendor_name = serializers.CharField(source='vendor.company_name', read_only=True)

    class Meta:
        model = Purchase
        fields = "__all__"

    def create(self, validated_data):
        # Separate PurchaseItem data
        items_data = validated_data.pop('items')

        # Create the Purchase instance
        purchase = Purchase.objects.create(**validated_data)

        # Create associated PurchaseItem instances and link them to the created Purchase instance
        for item_data in items_data:
            item_data['purchase'] = purchase  # Associate the item with the created Purchase
            PurchaseItem.objects.create(**item_data)

        return purchase

    def update(self, instance, validated_data):
        # Separate PurchaseItem data
        items_data = validated_data.pop('items')

        # Update Purchase instance fields
        instance.vendor = validated_data.get('vendor', instance.vendor)
        instance.invoice_number = validated_data.get('invoice_number', instance.invoice_number)
        instance.purchase_date = validated_data.get('purchase_date', instance.purchase_date)
        instance.discount = validated_data.get('discount', instance.discount)
        instance.amount_paid = validated_data.get('amount_paid', instance.amount_paid)
        instance.subtotal = validated_data.get('subtotal', instance.subtotal)
        instance.grand_total = validated_data.get('grand_total', instance.grand_total)
        instance.balance_due = validated_data.get('balance_due', instance.balance_due)
        instance.total_tax = validated_data.get('total_tax', instance.total_tax)
        instance.status = validated_data.get('status', instance.status)
        instance.save()

        instance.recalculate_grand_total()

        # Clear old PurchaseItems and create new ones
        instance.items.all().delete()  # Delete existing PurchaseItems
        for item_data in items_data:
            item_data['purchase'] = instance  # Associate the item with the updated Purchase
            PurchaseItem.objects.create(**item_data)  # Create new PurchaseItems

        return instance
    
class StaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = Staff
        fields = "__all__"

class InvoiceDeliverySerializer(serializers.ModelSerializer):
    
    class Meta:
        model = InvoiceDelivery
        fields = ['id', 'delivery_address', 'city', 'state', 'pincode', 'landmark', 'delivery_notes',
                'status', 'assigned_to', 'transporter_name', 'transporter_gst_in', 'vehicle_number',
                'dispatched_at', 'delivered_at']

    def get_delivery(self, obj):
        return InvoiceDeliverySerializer(obj.delivery).data
        

class BankAccountDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BankAccountDetails
        fields = "__all__"
    
    def update(self, instance, validated_data):
        # Update all fields (including qr_code if it's part of validated_data)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
class BrandDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BrandDetails
        fields = "__all__"