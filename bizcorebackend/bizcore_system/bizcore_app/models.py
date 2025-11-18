from django.db import models
from django.utils import timezone
from decimal import Decimal, ROUND_HALF_UP,InvalidOperation
from num2words import num2words
import inflect
from datetime import date, timedelta, datetime
from django.core.exceptions import ValidationError
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework import status
from django.db.models import Sum
from django.apps import apps

class TimeStampedModel(models.Model):
    """Abstract base class with self-updating 'created_at' and 'updated_at' fields."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

# -----------------------
# CATEGORY MODEL
# -----------------------
class Category(TimeStampedModel):

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")

    def __str__(self):
        return self.name

# -----------------------
# PRODUCT MODEL
# -----------------------
class Product(TimeStampedModel):
    UNIT_CHOICES = [
        ("pcs", "Pieces (pcs)"),
        ("nos", "Numbers (nos)"),
        ("kg", "Kilogram (kg)"),
        ("g", "Gram (g)"),
        ("ton", "Tonne (ton)"),
        ("litre", "Litre (l)"),
        ("ml", "Millilitre (ml)"),
        ("m", "Metre (m)"),
        ("cm", "Centimetre (cm)"),
        ("inch", "Inch"),
        ("session", "Session"),
        ("package", "Package"),
    ]

    GST_CHOICES = [
        (0, "0%"),
        (5, "5%"),
        (12, "12%"),
        (18, "18%"),
        (28, "28%"),
        (1.5, "1.5%"),
        (3, "3%"),
        (6, "6%"),
        (7.5, "7.5%"),
        (40, "40%"),
        ("nil", "Nil rated"),
        ("exempt", "Exempt"),
        ("non-gst", "Non-GST"),
    ]

    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
        ("out_of_stock", "Out of Stock"),
    ]

    name = models.CharField(max_length=255)
    sku_code = models.CharField(max_length=50)
    barcode = models.CharField(max_length=100, blank=True, null=True)

    purchase_price = models.DecimalField(max_digits=10, decimal_places=2)
    retail_price = models.DecimalField(max_digits=10, decimal_places=2)
    wholesale_price = models.DecimalField(max_digits=10, decimal_places=2)
    mrp = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)

    unit_of_measurement = models.CharField(max_length=20, choices=UNIT_CHOICES, default="pcs")
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # percentage
    gst_rate =  models.CharField(max_length=20, choices=GST_CHOICES, default=0)
    purchase_gst = models.CharField(max_length=20, choices=GST_CHOICES, default=0)  # New field for purchase GST
    stock_quantity = models.PositiveIntegerField(default=0)
    re_order_level = models.PositiveIntegerField(default=0)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    hsn_sac_code = models.CharField(max_length=20, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.sku_code})"
    
    def save(self, *args, **kwargs):
        # Set the status to 'out_of_stock' if stock_quantity is 0
        if self.stock_quantity == 0:
            self.status = 'out_of_stock'
        else:
            self.status = 'active'  # Reset to 'active' if stock is greater than 0
        
        super().save(*args, **kwargs)

# -----------------------
# CUSTOMER MODEL
# -----------------------
class Customer(TimeStampedModel):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("inactive", "Inactive"),
    ]

    CUSTOMER_TYPE_CHOICES = [
        ("individual", "Individual"),
        ("business", "Business"),
    ]

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=12, unique=True)
    email = models.EmailField(blank=True, null=True)

    billing_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=10, blank=True, null=True)

    gst_number = models.CharField(max_length=15, blank=True, null=True)
    pan_number = models.CharField(max_length=10, blank=True, null=True)

    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="active")

    credit_earned = models.PositiveIntegerField(default=0)  
    credit_used_count = models.PositiveIntegerField(default=0)
    whole_total_purchase_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0.00)

    customer_type = models.CharField(
        max_length=10,
        choices=CUSTOMER_TYPE_CHOICES,
        default="individual"
    )


    def __str__(self):
        return f"{self.name} - {self.phone}"

# -----------------------
# DRAFT INVOICE MODEL
# -----------------------
class DraftInvoice(TimeStampedModel):
    
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("finalized", "Finalized"),
        ("cancelled", "Cancelled"),
    ]

    TAX_STATUS_CHOICES = [
        ("unpaid", "Unpaid"),
        ("paid", "Paid"),
    ]

    customer = models.ForeignKey("Customer", on_delete=models.CASCADE, related_name="draft_invoices")
    draft_number = models.CharField(max_length=20, unique=True, blank=True)  # Auto DFT-0001
    
    invoice_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    tax_status = models.CharField(max_length=20, choices=TAX_STATUS_CHOICES, default="unpaid")

    draft_date = models.DateField(auto_now_add=True)

    sub_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_gst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_cgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_sgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_igst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    round_off = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))

    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    due_date = models.DateField(blank=True, null=True)
    transportation_mode = models.CharField(max_length=20, choices=[("none", "None"),("road", "Road"), ("rail", "Rail"), ("air", "Air"), ("sea", "Sea")],
            default="none")

    invoice_type = models.CharField(max_length=20, choices=[("individual", "Retailer"), ("business", "Wholesaler")], default="individual")

    mode_of_supply = models.CharField(max_length=20, choices=[("direct", "Direct"), ("delivery", "Delivery")], default="direct")

    invoice_value = models.TextField(blank=True, null=True)  # in words

    gst_type = models.CharField(max_length=20, choices=[("cgst_sgst", "CGST + SGST"), ("igst", "IGST")], default="cgst_sgst")

    created_by = models.ForeignKey("Staff", on_delete=models.SET_NULL, null=True, blank=True, related_name="draft_invoices_created")
    
    updated_by = models.ForeignKey("Staff", on_delete=models.SET_NULL, null=True, blank=True, related_name="draft_invoices_updated")

    total_input_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_output_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_payable_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def calculate_totals(self):
        """Recalculate totals and apply round-off."""
        sub_total = sum(item.net_value for item in self.items.all())
        total_gst = sum(item.gst_amount for item in self.items.all())
        total_cgst = sum(item.cgst_amount for item in self.items.all())
        total_sgst = sum(item.sgst_amount for item in self.items.all())
        total_igst = sum(item.igst_amount for item in self.items.all())
        total_input_tax = sum(item.input_tax for item in self.items.all())
        total_output_tax = sum(item.output_tax for item in self.items.all())
        
        # Update the tax totals on the invoice
        self.total_input_tax = total_input_tax
        self.total_output_tax = total_output_tax
        self.total_payable_tax = total_output_tax - total_input_tax

        exact_total = sub_total + total_gst
        rounded_total = round(exact_total)
        round_off = rounded_total - exact_total

        # Update self
        self.sub_total = sub_total
        self.total_gst = total_gst
        self.total_cgst = total_cgst
        self.total_sgst = total_sgst
        self.total_igst = total_igst
        self.total = exact_total
        self.round_off = round_off
        self.grand_total = rounded_total

        self.save()  # Ensure changes are saved

    def save(self, *args, **kwargs):
        if not self.draft_number:
            last_draft = DraftInvoice.objects.exclude(draft_number="").order_by("-id").first()
            last_number = 0

            if last_draft and last_draft.draft_number and "-" in last_draft.draft_number:
                try:
                    last_number = int(last_draft.draft_number.split("-")[1])
                except (IndexError, ValueError):
                    last_number = last_draft.id  # fallback to ID

            new_number = last_number + 1
            self.draft_number = f"DFT-{new_number:04d}"  # e.g. DFT-0001

            # Ensure uniqueness of draft_number by checking for duplicates
            while DraftInvoice.objects.filter(draft_number=self.draft_number).exists():
                new_number += 1
                self.draft_number = f"DFT-{new_number:04d}"

        # If 'created_by' is not already set, assign the current user
        if not self.created_by:
            self.created_by = kwargs.get('created_by', None)
        
        # If 'updated_by' is not already set, assign the current user
        self.updated_by = kwargs.get('updated_by', self.created_by)  # Set updated_by to created_by by default
        
        super().save(*args, **kwargs)


    def __str__(self):
        return f"Draft {self.draft_number}"

# -----------------------
# DRAFT INVOICEITEM MODEL
# -----------------------

class DraftInvoiceItem(models.Model):
    draft_invoice = models.ForeignKey("DraftInvoice", on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("Product", on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    hsn_sac = models.CharField(max_length=20)
    rate = models.DecimalField(max_digits=12, decimal_places=2)
    uom = models.CharField(max_length=20)  # unit of measurement
    quantity = models.PositiveIntegerField(default=1)
    special_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    net_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    cgst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    sgst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    igst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    cgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    igst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    item_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

     # New fields for input and output tax
    input_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # purchase_price * purchase_gst
    output_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # retail_price * gst_rate


    def calculate_tax(self):
            """Calculate the input tax and output tax based on purchase price and retail price."""
        
            # Get the necessary values from the Product model
            purchase_price = self.product.purchase_price  # The price at which the product was purchased
            purchase_gst = self.product.purchase_gst  # GST percentage on the purchase price
            
            # Try to convert purchase_gst to Decimal safely
            try:
                purchase_gst = Decimal(purchase_gst) if purchase_gst else Decimal('0.00')
            except InvalidOperation:
                purchase_gst = Decimal('0.00')  # Fallback to 0 if conversion fails

            net_value = self.net_value  # The price at which the product is sold to the customer
            gst_rate = Decimal(self.product.gst_rate) if self.product.gst_rate else Decimal('0.00')  # GST percentage on retail price
        
            if net_value < 0:
                net_value = Decimal("0.00")  # Ensure net value is not negative
            
            # Calculate Input Tax (GST paid on the purchase price)
            self.input_tax = (purchase_price * purchase_gst / Decimal("100")) * self.quantity
            
            # Calculate Output Tax (GST charged on the sale price or net value)
            self.output_tax = (net_value * gst_rate / Decimal("100"))

            self.save()  

            # You could also print or log the values for debugging if needed
            print(f"Input Tax: {self.input_tax}, Output Tax: {self.output_tax}, Item Total: {self.item_total}")

    def convert_to_words(self, amount):
        """
        Convert the total amount to words and return it as 'rupees only'
        """
        p = inflect.engine()
        words = p.number_to_words(amount).replace(", and", "").replace(",", "")
        return f"{words} rupees only"

    def calculate_gst(self):
        """
        Calculate GST, CGST, SGST, IGST for the given product and net value.
        """

        # Calculate net value after discount and special discount
        net_value = (self.quantity * self.rate) - (self.quantity * self.discount) - self.special_discount
        
        if net_value < 0:
            net_value = Decimal("0.00")  # Ensure net value is not negative

        self.net_value = net_value

        # Get GST percentage from the product
        gst_percentage = Decimal(self.product.gst_rate or "0.00")
        self.gst_percentage = gst_percentage
        
        # Set the CGST, SGST, and IGST percentages based on gst_type
        if self.draft_invoice.gst_type == "cgst_sgst":
            self.cgst_percentage = gst_percentage / Decimal("2")  # 50% of the GST for CGST
            self.sgst_percentage = gst_percentage / Decimal("2")  # 50% of the GST for SGST
            self.igst_percentage = Decimal("0.00")  # IGST = 0 for CGST+SGST
        else:  # If gst_type == "igst"
            self.cgst_percentage = Decimal("0.00")
            self.sgst_percentage = Decimal("0.00")
            self.igst_percentage = gst_percentage  # Full GST for IGST

        # Calculate the GST amount based on net_value
        gst_amount = net_value * (gst_percentage / Decimal("100"))

        cgst_amount = sgst_amount = igst_amount = Decimal("0.00")
        
        if self.draft_invoice.gst_type == "cgst_sgst":
            cgst_amount = gst_amount / Decimal("2")
            sgst_amount = gst_amount / Decimal("2")
            igst_amount = Decimal("0.00")  # Explicitly set IGST to 0

        elif self.draft_invoice.gst_type == "igst":
            igst_amount = gst_amount
            cgst_amount = Decimal("0.00")
            sgst_amount = Decimal("0.00")
        
        # Set the calculated amounts
        self.gst_amount = gst_amount
        self.cgst_amount = cgst_amount
        self.sgst_amount = sgst_amount
        self.igst_amount = igst_amount
        
        # Calculate Item Total (Net value + GST)
        item_total = net_value + gst_amount
        self.item_total = item_total

        # Update the grand_total before converting to words
        self.draft_invoice.calculate_totals()  # Ensure grand_total is updated
        
        # Update the invoice_value field in DraftInvoice model
        self.draft_invoice.invoice_value = self.convert_to_words(self.draft_invoice.grand_total)
        
        # Save the DraftInvoice after updating the invoice_value
        self.draft_invoice.save()

    def delete_item(request, draft_invoice_id, item_id):
        try:
            # Attempt to find the DraftInvoiceItem by the given item_id
            item = DraftInvoiceItem.objects.get(id=item_id, draft_invoice_id=draft_invoice_id)
            item.delete()  # Delete the item

            return Response({"message": "Item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except DraftInvoiceItem.DoesNotExist:
            # If the item doesn't exist, return an error response
            raise NotFound(detail="DraftInvoiceItem not found")

    def save(self, *args, **kwargs):
        # Call GST calculation before saving
        self.calculate_gst()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.quantity})"


# -----------------------
# INVOICE MODEL
# -----------------------

class Invoice(TimeStampedModel):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("returned", "Returned"),
        ("amended", "Amended"),
        ("archived", "Archived"), 
    ]

    TAX_STATUS_CHOICES = [
        ("unpaid", "Unpaid"),
        ("paid", "Paid"),
    ]

    PAYMENT_STATUS = [
        ("paid", "Paid"),
        ("unpaid", "Unpaid"),
        ("partial", "Partial Paid"),
    ]


    customer = models.ForeignKey("Customer", on_delete=models.CASCADE, related_name="invoices")
    invoice_number = models.CharField(max_length=30, unique=True, editable=False)
    invoice_date = models.DateField(auto_now_add=True)
    due_date = models.DateField(blank=True, null=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="unpaid")
    invoice_status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="active"
    )

    invoice_type = models.CharField(
        max_length=20,
        choices=[("individual", "Retailer"), ("business", "Wholesaler")],
        default="individual"
    )

    tax_status = models.CharField(
        max_length=20,
        choices=TAX_STATUS_CHOICES,
        default="unpaid"
    )

    sub_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_gst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_cgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_sgst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_igst = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    transportation_mode = models.CharField(
        max_length=20,
        choices=[("none", "None"), ("road", "Road"), ("rail", "Rail"), ("air", "Air"), ("ship", "Ship/Sea")],
        default="none"
    )
    mode_of_supply = models.CharField(
        max_length=20,
        choices=[("direct", "Direct"), ("delivery", "Delivery")],
        default="direct"
    )
    round_off = models.DecimalField(  # difference due to rounding
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )

    gst_type = models.CharField(
        max_length=20,
        choices=[("cgst_sgst", "CGST + SGST"), ("igst", "IGST")],
        default="cgst_sgst"
    )

    invoice_value = models.TextField(blank=True, null=True)  # in words

    # Staff tracking fields
    created_by = models.ForeignKey(
        "Staff", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="invoices_created"
    )
    
    updated_by = models.ForeignKey(
        "Staff", 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True, 
        related_name="invoices_updated"
    )

    total_input_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_output_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_payable_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            current_year = timezone.now().year
            last_invoice = Invoice.objects.filter(
                invoice_number__startswith=f"INV-{current_year}"
            ).order_by("-id").first()

            if last_invoice:
                last_number = int(last_invoice.invoice_number.split("-")[2])
                new_number = last_number + 1
            else:
                new_number = 1

            self.invoice_number = f"INV-{current_year}-{new_number:04d}"  # e.g. INV-2025-0001
        
        # If 'created_by' is not already set, assign it from kwargs
        if not self.created_by:
            self.created_by = kwargs.get('created_by', None)
        
        # If 'updated_by' is not already set, assign it from kwargs or default to 'created_by'
        if not self.updated_by:
            self.updated_by = kwargs.get('updated_by', self.created_by)  # If not set, use created_by

        # self.update_tax_totals()

        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Instead of deleting, just mark as deleted and archive the invoice
        self.is_deleted = True
        self.invoice_status = "archived"
        self.save()

    def calculate_totals(self):
        """Recalculate totals and apply round-off."""
        sub_total = sum(item.net_value for item in self.items.all())
        total_gst = sum(item.gst_amount for item in self.items.all())
        total_cgst = sum(item.cgst_amount for item in self.items.all())
        total_sgst = sum(item.sgst_amount for item in self.items.all())
        total_igst = sum(item.igst_amount for item in self.items.all())
        total_input_tax = sum(item.input_tax for item in self.items.all())
        total_output_tax = sum(item.output_tax for item in self.items.all())
        
        # Update the tax totals on the invoice
        self.total_input_tax = total_input_tax
        self.total_output_tax = total_output_tax
        self.total_payable_tax = total_output_tax - total_input_tax

        exact_total = sub_total + total_gst
        rounded_total = round(exact_total)
        round_off = rounded_total - exact_total

        # update self
        self.sub_total = sub_total
        self.total_gst = total_gst
        self.total_cgst = total_cgst
        self.total_sgst = total_sgst
        self.total_igst = total_igst
        self.total = exact_total
        self.round_off = round_off
        self.grand_total = rounded_total
        
        self.save()  # Ensure changes are saved

    def update_payment_status(self):
        # Calculate total paid amount
        total_paid = self.payments.aggregate(total_paid=models.Sum('amount_paid'))['total_paid'] or 0

        # Calculate the remaining balance due
        balance_due = self.grand_total - total_paid

        # Update payment status based on the total paid
        if total_paid == self.grand_total:
            self.payment_status = 'paid'
        elif total_paid > 0:
            self.payment_status = 'partial'
        else:
            self.payment_status = 'unpaid'
        
        self.save()

        return balance_due  # Return balance_due for the client to know how much is left

    def __str__(self):
        return f"Invoice {self.invoice_number}"

class InvoiceItem(TimeStampedModel):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("Product", on_delete=models.CASCADE)

    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50)
    hsn_sac = models.CharField(max_length=20)

    rate = models.DecimalField(max_digits=12, decimal_places=2)
    uom = models.CharField(max_length=20)
    quantity = models.PositiveIntegerField(default=1)

    special_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    net_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    gst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    cgst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    sgst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    igst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    cgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    sgst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    igst_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    item_total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    # New fields for input and output tax
    input_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # purchase_price * purchase_gst
    output_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # retail_price * gst_rate

    def convert_to_words(self, amount):
        """
        Convert the total amount to words and return it as 'rupees only'
        """
        p = inflect.engine()
        words = p.number_to_words(amount).replace(", and", "").replace(",", "")
        return f"{words} rupees only"

    def calculate_gst(self):
        """
        Calculate GST, CGST, SGST, IGST for the given product and net value.
        """
        # Calculate net value after discount and special discount
        net_value = (self.quantity * self.rate) - (self.quantity * self.discount) - self.special_discount
        
        if net_value < 0:
            net_value = Decimal("0.00")  # Ensure net value is not negative

        self.net_value = net_value

        # Get GST percentage from the product
        gst_percentage = Decimal(self.product.gst_rate or "0.00")
        self.gst_percentage = gst_percentage
        
        # Set the CGST, SGST, and IGST percentages based on gst_type
        if self.invoice.gst_type == "cgst_sgst":
            self.cgst_percentage = gst_percentage / Decimal("2")  # 50% of the GST for CGST
            self.sgst_percentage = gst_percentage / Decimal("2")  # 50% of the GST for SGST
            self.igst_percentage = Decimal("0.00")  # IGST = 0 for CGST+SGST
        else:  # If gst_type == "igst"
            self.cgst_percentage = Decimal("0.00")
            self.sgst_percentage = Decimal("0.00")
            self.igst_percentage = gst_percentage  # Full GST for IGST

        # Calculate the GST amount based on net_value
        gst_amount = net_value * (gst_percentage / Decimal("100"))

        cgst_amount = sgst_amount = igst_amount = Decimal("0.00")
        
        if self.invoice.gst_type == "cgst_sgst":
            cgst_amount = gst_amount / Decimal("2")
            sgst_amount = gst_amount / Decimal("2")
            igst_amount = Decimal("0.00")  # Explicitly set IGST to 0

        elif self.invoice.gst_type == "igst":
            igst_amount = gst_amount
            cgst_amount = Decimal("0.00")
            sgst_amount = Decimal("0.00")
        
        # Set the calculated amounts
        self.gst_amount = gst_amount
        self.cgst_amount = cgst_amount
        self.sgst_amount = sgst_amount
        self.igst_amount = igst_amount
        
        # Calculate Item Total (Net value + GST)
        item_total = net_value + gst_amount
        self.item_total = item_total

        # Update the grand_total before converting to words
        self.invoice.calculate_totals()  # Ensure grand_total is updated
        
        # Update the invoice_value field in DraftInvoice model
        self.invoice.invoice_value = self.convert_to_words(self.invoice.grand_total)
        
        # Save the DraftInvoice after updating the invoice_value
        self.invoice.save()
    
    def calculate_tax(self):
        """Calculate the input tax and output tax based on purchase price and retail price."""
        
        # Get the necessary values from the Product model
        purchase_price = self.product.purchase_price  # The price at which the product was purchased
        purchase_gst = self.product.purchase_gst  # GST percentage on the purchase price
            
        # Try to convert purchase_gst to Decimal safely
        try:
            purchase_gst = Decimal(purchase_gst) if purchase_gst else Decimal('0.00')
        except InvalidOperation:
            purchase_gst = Decimal('0.00')  # Fallback to 0 if conversion fails

        net_value = self.net_value  # The price at which the product is sold to the customer
        gst_rate = Decimal(self.product.gst_rate) if self.product.gst_rate else Decimal('0.00')  # GST percentage on retail price
        
        if net_value < 0:
            net_value = Decimal("0.00")  # Ensure net value is not negative
        
        # Calculate Input Tax (GST paid on the purchase price)
        self.input_tax = (purchase_price * purchase_gst / Decimal("100")) * self.quantity
        
        # Calculate Output Tax (GST charged on the sale price or net value)
        self.output_tax = (net_value * gst_rate / Decimal("100"))
        
        # Calculate the total item amount including the output tax (net value + output tax)
        self.item_total = net_value + self.output_tax
        
        # Optionally, you can update the invoice totals here if needed
        self.invoice.calculate_totals()  # Ensure the grand_total is updated

        # Save the invoice if needed
        self.invoice.save()

        # You could also print or log the values for debugging if needed
        print(f"Input Tax: {self.input_tax}, Output Tax: {self.output_tax}, Item Total: {self.item_total}")

    def save(self, *args, **kwargs):
        # Ensure that missing values have a default
        if self.quantity is None:
            self.quantity = Decimal("1")
        if self.rate is None:
            self.rate = Decimal("0.00")
        if self.discount is None:
            self.discount = Decimal("0.00")
        if self.special_discount is None:
            self.special_discount = Decimal("0.00")

        # Ensure that all values are treated as Decimal before calculations
        self.quantity = Decimal(self.quantity)
        self.rate = Decimal(self.rate)
        self.discount = Decimal(self.discount)
        self.special_discount = Decimal(self.special_discount)

        # Call GST calculation and Tax Calculation before saving
        self.calculate_gst()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.quantity})"

class Payment(models.Model):
    PAYMENT_MODES = [
        ("cash", "Cash"),
        ("card", "Card"),
        ("upi", "UPI"),
        ("bank", "Bank Transfer"),
        ("credit", "Credit"),
        ("wallet", "Wallet"),
        ("hybrid", "Hybrid (Cash + Online)"),
    ]

    PAYMENT_STATUS = [
        ("paid", "Paid"),
        ("unpaid", "Unpaid"),
        ("partial", "Partial Paid"),
        ("reversed", "Reversed"),
        ("failed", "Failed"),
    ]

    invoice = models.ForeignKey("Invoice", on_delete=models.CASCADE, related_name="payments")
    customer = models.ForeignKey("Customer", on_delete=models.CASCADE, related_name="payments")

    bill_amount = models.DecimalField(max_digits=12, decimal_places=2)  # invoice grand_total
    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    balance_due = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    # Hybrid-specific fields
    cash_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    online_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    paid_at = models.DateTimeField(auto_now_add=True)
    reference_number = models.CharField(max_length=100, blank=True, null=True)

    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODES, default='cash')
    total_balance_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default="unpaid")

    due_date = models.DateField(blank=True, null=True)

    created_at = models.DateTimeField(default=timezone.now)

    def save(self, *args, **kwargs):
        if self.payment_mode == "hybrid":
            # Hybrid → auto calculate amount_paid based on cash and online
            self.amount_paid = self.cash_amount + self.online_amount
        else:
            # Non-hybrid → manual input, reset hybrid fields
            self.cash_amount = 0
            self.online_amount = 0

        # Get the grand_total from the associated invoice
        self.bill_amount = self.invoice.grand_total

        # Calculate total_paid from all previous payments related to this invoice
        total_paid = self.invoice.payments.aggregate(total_paid=models.Sum('amount_paid'))['total_paid'] or 0
        total_paid = Decimal(total_paid)

        # Calculate the remaining balance due
        remaining_balance = Decimal(self.bill_amount) - total_paid  # Ensure it is Decimal

        # Check if the total paid amount exceeds the remaining balance
        if self.amount_paid > remaining_balance:
            raise ValidationError(f"The total paid amount cannot be greater than {remaining_balance:.2f}. You have only {remaining_balance:.2f} left to pay.")

        # Update the balance_due
        self.balance_due = remaining_balance - Decimal(self.amount_paid)  # Cast to Decimal

        # Set payment status based on the amount paid
        if self.amount_paid == 0:
            self.payment_status = "unpaid"
        elif self.amount_paid < self.bill_amount:
            self.payment_status = "partial"
        else:
            self.payment_status = "paid"

        # Set due_date based on payment status
        if self.payment_status == "paid":
            self.due_date = date.today()  # Set due date to today's date if fully paid
        elif self.payment_status == "partial":
            self.due_date = date.today() + timedelta(days=30)  # Set due date for partial payments
        else:
            self.due_date = None  # No due date for unpaid payments

        # If the grand_total changes, update the balance_due
        if self.invoice.grand_total != self.bill_amount:
            self.balance_due = self.invoice.grand_total - total_paid - self.amount_paid

        super().save(*args, **kwargs)

         # Now, check if the Invoice's due_date is empty and set it based on Payment's due_date
        if self.due_date and not self.invoice.due_date:
            self.invoice.due_date = self.due_date
            self.invoice.save()

    def __str__(self):
        return f"Payment for Invoice {self.invoice.invoice_number} ({self.payment_status})"

# -----------------------
# DELIVERY MODEL
# -----------------------
class Delivery(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    draft_invoice = models.OneToOneField("DraftInvoice", on_delete=models.CASCADE, related_name="delivery", null=True, blank=True)

    # Delivery Address Fields
    delivery_address = models.TextField()  # Full address for delivery
    city = models.CharField(max_length=100, blank=True, null=True)  # City of delivery
    state = models.CharField(max_length=100, blank=True, null=True)  # State of delivery
    pincode = models.CharField(max_length=10, blank=True, null=True)  # Postal code of the delivery area
    landmark = models.CharField(max_length=255, blank=True, null=True)  # Landmark for easy identification

    delivery_notes = models.CharField(max_length=255, blank=True, null=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    assigned_to = models.CharField(max_length=100, blank=True, null=True)  # staff name/code
    transporter_name = models.CharField(max_length=100, blank=True, null=True)  # eg: DTDC, FedEx
    transporter_gst_in = models.CharField(max_length=15, blank=True, null=True)  # GSTIN of transporter
    vehicle_number = models.CharField(max_length=20, blank=True, null=True)

    dispatched_at = models.DateField(blank=True, null=True)
    delivered_at = models.DateField(blank=True, null=True)

class InvoiceDelivery(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    invoice = models.OneToOneField("Invoice", on_delete=models.CASCADE, related_name="delivery", null=True, blank=True)

    # Delivery Address Fields
    delivery_address = models.TextField()  # Full address for delivery
    city = models.CharField(max_length=100, blank=True, null=True)  # City of delivery
    state = models.CharField(max_length=100, blank=True, null=True)  # State of delivery
    pincode = models.CharField(max_length=10, blank=True, null=True)  # Postal code of the delivery area
    landmark = models.CharField(max_length=255, blank=True, null=True)  # Landmark for easy identification

    delivery_notes = models.CharField(max_length=255, blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    assigned_to = models.CharField(max_length=100, blank=True, null=True)  # staff name/code
    transporter_name = models.CharField(max_length=100, blank=True, null=True)  # eg: DTDC, FedEx
    transporter_gst_in = models.CharField(max_length=15, blank=True, null=True)  # GSTIN of transporter
    vehicle_number = models.CharField(max_length=20, blank=True, null=True)

    dispatched_at = models.DateField(blank=True, null=True)
    delivered_at = models.DateField(blank=True, null=True)

# -----------------------
# VENDOR MODEL
# -----------------------
class Vendor(TimeStampedModel):
    VENDOR_STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
    ]

    company_name = models.CharField(max_length=200, blank=True, null=True)  # New field for company name
    contact_person = models.CharField(max_length=200, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    gst_number = models.CharField(max_length=20, blank=True, null=True)
    pan_number = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # Balance owed to vendor
    total_purchases = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # Total amount purchased
    status = models.CharField(max_length=10, choices=VENDOR_STATUS_CHOICES, default='active')


    def __str__(self):
        return f"{self.company_name} - ({self.phone})"

# -----------------------
# PURCHASE MODEL
# -----------------------
class Purchase(TimeStampedModel):
    vendor = models.ForeignKey(Vendor, on_delete=models.SET_NULL, null=True, related_name="purchases")
    invoice_number = models.CharField(max_length=50, blank=True, null=True)  # Vendor bill number
    purchase_date = models.DateField()

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    total_tax = models.DecimalField(max_digits=50, decimal_places=2, default=0.00)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    grand_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    amount_paid = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    balance_due = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partially Paid'),
        ('paid', 'Paid'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"Purchase {self.id} from {self.vendor}"
    
    def save(self, *args, **kwargs):
        # Automatically calculate grand_total if it's not provided
        if not self.grand_total:
            self.grand_total = self.subtotal + self.total_tax - self.discount

        # Determine the status based on grand_total and amount_paid
        if self.grand_total == self.amount_paid:
            self.status = 'paid'
        elif self.grand_total < self.amount_paid:
            self.status = 'partial'
        elif self.amount_paid == 0.00:
            self.status = 'pending'

        # Call the parent class's save method
        super().save(*args, **kwargs)
    
    def recalculate_grand_total(self):
        """Recalculate the grand total for the purchase."""
        self.grand_total = self.subtotal + self.total_tax - self.discount
        self.balance_due = self.grand_total - Decimal(str(self.amount_paid))  # Convert amount_paid to Decimal
        self.save()  # Save after recalculating totals


# -----------------------
# PURCHASE ITEM MODEL
# -----------------------
class PurchaseItem(TimeStampedModel):
    purchase = models.ForeignKey(Purchase, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("Product", on_delete=models.SET_NULL, null=True, related_name="purchase_items")


    name = models.CharField(max_length=255, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=0)
    unit_cost = models.DecimalField(max_digits=12, decimal_places=2)
    rate = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)   # Vendor cost price per unit
    total_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # Total cost (unit_cost * quantity)
    
    hsn_sac = models.CharField(max_length=20, null=True, blank=True)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    gst_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    total_tax = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # Tax per item
    item_total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)  # item total 

    
    def save(self, *args, **kwargs):
        # Calculate item total (unit_cost * quantity) before saving
        self.item_total = self.unit_cost * self.quantity

        # Call the parent save method
        super().save(*args, **kwargs)

        # Recalculate purchase grand total when the item is saved
        self.purchase.recalculate_grand_total()  # Call a method on the Purchase model


class BankAccountDetails(TimeStampedModel):
    bank_name = models.CharField(max_length=100)
    branch = models.CharField(max_length=100)
    ifsc_code = models.CharField(max_length=11)  # IFSC code typically 11 characters
    account_number = models.CharField(max_length=20)  # Max length for account number
    upi_id = models.CharField(max_length=100, blank=True, null=True)
    qr_code = models.ImageField(upload_to='bank_qr_codes/', null=True, blank=True)  # Store QR code image

    def __str__(self):
        return f"{self.bank_name} - {self.branch}"


class BrandDetails(TimeStampedModel):
    # Business Brand Information
    company_name = models.CharField(max_length=80) 
    company_caption = models.CharField(max_length=255, blank=True, null=True)
    
    # Business Type: Wholesale, Retail, or both
    BUSINESS_TYPE_CHOICES = [
        ('wholesale', 'Wholesale'),
        ('retail', 'Retail'),
        ('wholesale_retail', 'Wholesale & Retail'),
    ]
    business_type = models.CharField(
        max_length=20,
        choices=BUSINESS_TYPE_CHOICES,
        default='retail'
    )
    
    # Contact Information
    telephone =  models.CharField(max_length=15, blank=True, null=True)
    mobile_number =  models.CharField(max_length=15, blank=True, null=True)
    whatsapp_number = models.CharField(max_length=15, blank=True, null=True)
    business_email = models.EmailField(blank=True, null=True)
    website_name = models.CharField(max_length=50, blank=True, null=True)

    # GST and PAN Details
    gst_in_number = models.CharField(max_length=50, blank=True, null=True)
    business_pan_number = models.CharField(max_length=50, blank=True, null=True)

    # Business Address
    address = models.CharField(max_length=150, blank=True, null=True)
    city = models.CharField(max_length=150, blank=True, null=True)
    state_name = models.CharField(max_length=50, blank=True, null=True)
    pincode = models.CharField(max_length=50, blank=True, null=True)

    # Logo field (Image)
    logo = models.ImageField(upload_to='business_logos/', null=True, blank=True)

class Staff(TimeStampedModel):
    ROLE_CHOICES = [
        ("cashier", "Cashier"),
        ("manager", "Manager"),
        ("admin", "Admin"),
        ("sales", "Sales"),
        # Add other roles as needed
    ]

    name = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default="cashier")  # Only cashier can create invoices
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=[("active", "Active"), ("inactive", "Inactive")], default="active")

    def __str__(self):
        return f"{self.name} ({self.role})"
