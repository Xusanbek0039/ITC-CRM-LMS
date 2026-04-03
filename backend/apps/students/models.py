from django.db import models
from core.models import BaseModel


class Student(BaseModel):
    """O'quvchi profili."""

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Faol'
        FROZEN = 'frozen', 'Muzlatilgan'
        GRADUATED = 'graduated', 'Bitirgan'
        LEFT = 'left', 'Ketgan'

    user = models.OneToOneField(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='student_profile',
    )
    parent_phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    birth_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )
    notes = models.TextField(blank=True)
    enrolled_date = models.DateField(auto_now_add=True)

    class Meta:
        verbose_name = "O'quvchi"
        verbose_name_plural = "O'quvchilar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.full_name} ({self.get_status_display()})"
