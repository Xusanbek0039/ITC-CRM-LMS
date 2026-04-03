import uuid

from django.db import models


class Schedule(models.Model):
    """Dars jadvali."""

    class DayOfWeek(models.TextChoices):
        MONDAY = 'monday', 'Dushanba'
        TUESDAY = 'tuesday', 'Seshanba'
        WEDNESDAY = 'wednesday', 'Chorshanba'
        THURSDAY = 'thursday', 'Payshanba'
        FRIDAY = 'friday', 'Juma'
        SATURDAY = 'saturday', 'Shanba'
        SUNDAY = 'sunday', 'Yakshanba'

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.CASCADE,
        related_name='schedules',
    )
    day_of_week = models.CharField(
        max_length=10,
        choices=DayOfWeek.choices,
    )
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.ForeignKey(
        'groups.Room',
        on_delete=models.SET_NULL,
        null=True,
        related_name='schedules',
    )

    class Meta:
        verbose_name = 'Dars jadvali'
        verbose_name_plural = 'Dars jadvallari'
        unique_together = ['group', 'day_of_week']
        ordering = ['day_of_week', 'start_time']

    def __str__(self):
        return f"{self.group} — {self.get_day_of_week_display()} {self.start_time}-{self.end_time}"
