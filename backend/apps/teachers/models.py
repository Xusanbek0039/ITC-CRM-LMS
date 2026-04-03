from django.db import models
from core.models import BaseModel


class Teacher(BaseModel):
    """O'qituvchi profili."""

    user = models.OneToOneField(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='teacher_profile',
    )
    specialization = models.CharField("Mutaxassislik", max_length=255)
    subjects = models.ManyToManyField(
        'courses.Course',
        related_name='teachers',
        blank=True,
    )
    work_start_time = models.TimeField("Ish boshlanishi", null=True, blank=True)
    work_end_time = models.TimeField("Ish tugashi", null=True, blank=True)
    work_days = models.JSONField("Ish kunlari", default=list, blank=True)
    bio = models.TextField("Bio", blank=True)

    class Meta:
        verbose_name = "O'qituvchi"
        verbose_name_plural = "O'qituvchilar"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.full_name} ({self.specialization})"
