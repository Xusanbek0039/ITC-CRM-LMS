import uuid

from django.db import models


class Notification(models.Model):
    """Bildirishnoma modeli."""

    class NotificationType(models.TextChoices):
        PAYMENT_REMINDER = 'payment_reminder', "To'lov eslatmasi"
        LESSON_REMINDER = 'lesson_reminder', 'Dars eslatmasi'
        ATTENDANCE_WARNING = 'attendance_warning', 'Davomat ogohlantirishи'
        SYSTEM = 'system', 'Tizim'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    recipient = models.ForeignKey(
        'accounts.User',
        on_delete=models.CASCADE,
        related_name='notifications',
    )
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(
        max_length=20,
        choices=NotificationType.choices,
        default=NotificationType.SYSTEM,
    )
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Bildirishnoma'
        verbose_name_plural = 'Bildirishnomalar'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.recipient} - {self.title}"
