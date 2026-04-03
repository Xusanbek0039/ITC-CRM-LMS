from django.db import models

from core.models import BaseModel


class Payment(BaseModel):
    """To'lov modeli."""

    class PaymentType(models.TextChoices):
        CASH = 'cash', 'Naqd'
        CARD = 'card', 'Karta'
        BANK = 'bank', 'Bank'
        CLICK = 'click', 'Click'
        PAYME = 'payme', 'Payme'

    student = models.ForeignKey(
        'students.Student',
        on_delete=models.PROTECT,
        related_name='payments',
    )
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.PROTECT,
        related_name='payments',
        null=True,
        blank=True,
    )
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    payment_type = models.CharField(
        max_length=10,
        choices=PaymentType.choices,
        default=PaymentType.CASH,
    )
    payment_date = models.DateField()
    period_month = models.DateField(help_text="Qaysi oy uchun to'lov")
    note = models.TextField(blank=True)
    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_payments',
    )

    class Meta:
        verbose_name = "To'lov"
        verbose_name_plural = "To'lovlar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.student} — {self.amount} ({self.get_payment_type_display()})"

    @property
    def net_amount(self):
        return self.amount - self.discount
