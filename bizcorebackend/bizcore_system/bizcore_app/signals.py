# bizcore_app/signals.py
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from .models import DraftInvoiceItem

@receiver(post_save, sender=DraftInvoiceItem)
def update_draft_totals_on_item_save(sender, instance, **kwargs):
    draft = instance.draft_invoice
    draft.calculate_totals()
    draft.save()

@receiver(post_delete, sender=DraftInvoiceItem)
def update_draft_totals_on_item_delete(sender, instance, **kwargs):
    draft = instance.draft_invoice
    draft.calculate_totals()
    draft.save()
