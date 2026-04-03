import uuid
from django.db import models

from core.models import BaseModel


class Lead(BaseModel):
    """Potensial o'quvchi (lead)."""

    class Source(models.TextChoices):
        PHONE = 'phone', 'Telefon'
        TELEGRAM = 'telegram', 'Telegram'
        INSTAGRAM = 'instagram', 'Instagram'
        WEBSITE = 'website', 'Veb-sayt'
        REFERRAL = 'referral', 'Tavsiya'
        AD = 'ad', 'Reklama'
        WALK_IN = 'walk_in', "O'zi kelgan"
        OTHER = 'other', 'Boshqa'

    class Status(models.TextChoices):
        NEW = 'new', 'Yangi'
        CONTACTED = 'contacted', "Bog'lanildi"
        TRIAL_SCHEDULED = 'trial_scheduled', 'Sinov darsi belgilandi'
        ENROLLED = 'enrolled', "Ro'yxatdan o'tdi"
        CANCELLED = 'cancelled', 'Bekor qilindi'

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    source = models.CharField(
        max_length=20,
        choices=Source.choices,
        default=Source.PHONE,
    )
    course_interest = models.ForeignKey(
        'courses.Course',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='leads',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
    )
    assigned_to = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_leads',
    )
    notes = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Lead'
        verbose_name_plural = 'Leadlar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.full_name} ({self.get_status_display()})"


class LeadHistory(models.Model):
    """Lead status o'zgarish tarixi."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    lead = models.ForeignKey(
        Lead,
        on_delete=models.CASCADE,
        related_name='history',
    )
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
    )
    note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Lead tarixi'
        verbose_name_plural = 'Lead tarixi'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.lead.full_name}: {self.old_status} → {self.new_status}"
