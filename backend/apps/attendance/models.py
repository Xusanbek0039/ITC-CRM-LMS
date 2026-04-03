import uuid
from django.db import models


class Attendance(models.Model):
    """Davomat jadvali — guruh + sana bo'yicha."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    group = models.ForeignKey(
        'groups.Group',
        on_delete=models.CASCADE,
        related_name='attendances',
    )
    date = models.DateField()
    created_by = models.ForeignKey(
        'accounts.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='created_attendances',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Davomat'
        verbose_name_plural = 'Davomatlar'
        unique_together = ['group', 'date']
        ordering = ['-date']

    def __str__(self):
        return f"{self.group} — {self.date}"


class AttendanceRecord(models.Model):
    """Har bir talabaning davomat yozuvi."""

    class Status(models.TextChoices):
        PRESENT = 'present', 'Kelgan'
        ABSENT = 'absent', 'Kelmagan'
        LATE = 'late', 'Kechikkan'
        EXCUSED = 'excused', 'Sababli'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    attendance = models.ForeignKey(
        Attendance,
        on_delete=models.CASCADE,
        related_name='records',
    )
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='attendance_records',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PRESENT,
    )
    note = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Davomat yozuvi'
        verbose_name_plural = 'Davomat yozuvlari'
        unique_together = ['attendance', 'student']

    def __str__(self):
        return f"{self.student} — {self.get_status_display()}"
