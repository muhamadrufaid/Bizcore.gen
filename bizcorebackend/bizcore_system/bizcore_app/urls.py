from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    CategoryViewSet, ProductViewSet, CustomerViewSet,
    DraftInvoiceViewSet, DraftInvoiceItemViewSet,
    InvoiceViewSet, InvoiceItemViewSet, 
    PaymentViewSet, DeliveryViewSet, StaffViewSet, PurchaseViewSet,
    PurchaseItemtViewSet, VendorViewSet, DeleteAllPayments, BankAccountDetailsViewSet,
    BrandDetailsViewSet, AlertsView, ProductCategoryStatsView, CustomerStatsView, VendorStatsView,
    DraftInvoiceStatsView, InvoiceStatsView, TaxStatsView, PaymentStateView, PurchaseStateView,
    AllOverViewStatsView,
)

router = DefaultRouter()
router.register("categories", CategoryViewSet)
router.register("products", ProductViewSet)
router.register("customers", CustomerViewSet)
router.register("vendors", VendorViewSet)
router.register("draft-invoices", DraftInvoiceViewSet)
router.register("draft-items", DraftInvoiceItemViewSet)
router.register("invoices", InvoiceViewSet)
router.register("invoice-items", InvoiceItemViewSet)
router.register("purchase", PurchaseViewSet)
router.register("purchse-items", PurchaseItemtViewSet)
router.register("payments", PaymentViewSet)
router.register("deliveries", DeliveryViewSet)
router.register("staffs", StaffViewSet)
router.register("bank-details", BankAccountDetailsViewSet)
router.register("brand-details", BrandDetailsViewSet)



urlpatterns = [
    path("", include(router.urls)),
    path('draft-invoices/<int:pk>/finalize/', DraftInvoiceViewSet.as_view({'post': 'finalize_invoice'})),
    path('payments/delete_all/', DeleteAllPayments.as_view(), name='delete_all_payments'),
    path('alerts/', AlertsView.as_view(), name='alerts'),
    path('product-category-stats/', ProductCategoryStatsView.as_view(), name='product-category-stats'),
    path('customer-stats/', CustomerStatsView.as_view(), name='customer-stats'),
    path('vendor-stats/', VendorStatsView.as_view(), name='vendor-stats'),
    path('draft-invoice-stats/', DraftInvoiceStatsView.as_view(), name='draft-invoice-stats'),
    path('invoice-stats/', InvoiceStatsView.as_view(), name='invoice-stats'),
    path('tax-stats/', TaxStatsView.as_view(), name='tax-stats'),
    path('payment-stats/', PaymentStateView.as_view(), name='payment-stats'),
    path('purchase-stats/', PurchaseStateView.as_view(), name='purchase-stats'),
    path('all-analytics-stats/', AllOverViewStatsView.as_view(), name='all-analytics-stats'),
   
]

