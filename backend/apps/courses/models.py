from django.db import models

from core.models import BaseModel


class Course(BaseModel):
    """Kurs modeli."""

    class PaymentType(models.TextChoices):
        MONTHLY = 'monthly', 'Oylik'
        FULL = 'full', "To'liq"

    name = models.CharField("Nomi", max_length=255)
    description = models.TextField("Tavsif", blank=True)
    duration_months = models.PositiveIntegerField("Davomiyligi (oy)")
    price = models.DecimalField("Narxi", max_digits=12, decimal_places=2)
    payment_type = models.CharField(
        "To'lov turi",
        max_length=10,
        choices=PaymentType.choices,
        default=PaymentType.MONTHLY,
    )
    is_active = models.BooleanField("Faolmi", default=True)

    class Meta:
        verbose_name = 'Kurs'
        verbose_name_plural = 'Kurslar'
        ordering = ['-created_at']

    def __str__(self):
        return self.name
