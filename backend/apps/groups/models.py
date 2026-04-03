from django.db import models

from core.models import BaseModel, TimeStampedModel


class Room(TimeStampedModel):
    """Dars xonasi."""

    name = models.CharField(max_length=100)
    capacity = models.PositiveIntegerField(default=30)
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Xona'
        verbose_name_plural = 'Xonalar'
        ordering = ['name']

    def __str__(self):
        return self.name


class Group(BaseModel):
    """O'quv guruhi."""

    class Status(models.TextChoices):
        FORMING = 'forming', 'Shakllanmoqda'
        ACTIVE = 'active', 'Faol'
        COMPLETED = 'completed', 'Yakunlangan'
        CANCELLED = 'cancelled', 'Bekor qilingan'

    name = models.CharField(max_length=255)
    course = models.ForeignKey(
        'courses.Course',
        on_delete=models.PROTECT,
        related_name='groups',
    )
    teacher = models.ForeignKey(
        'teachers.Teacher',
        on_delete=models.SET_NULL,
        null=True,
        related_name='groups',
    )
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)
    lesson_days = models.JSONField(default=list)
    lesson_start_time = models.TimeField()
    lesson_end_time = models.TimeField()
    room = models.ForeignKey(
        Room,
        on_delete=models.SET_NULL,
        null=True,
        related_name='groups',
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.FORMING,
    )
    max_students = models.PositiveIntegerField(default=20)

    class Meta:
        verbose_name = 'Guruh'
        verbose_name_plural = 'Guruhlar'
        ordering = ['-created_at']

    def __str__(self):
        return self.name


class GroupStudent(TimeStampedModel):
    """Guruh — talaba bog'lanishi."""

    class Status(models.TextChoices):
        ACTIVE = 'active', 'Faol'
        FROZEN = 'frozen', 'Muzlatilgan'
        LEFT = 'left', 'Chiqib ketgan'
        GRADUATED = 'graduated', 'Bitirgan'

    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name='group_students',
    )
    student = models.ForeignKey(
        'students.Student',
        on_delete=models.CASCADE,
        related_name='student_groups',
    )
    joined_date = models.DateField(auto_now_add=True)
    left_date = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
    )

    class Meta:
        verbose_name = 'Guruh talabasi'
        verbose_name_plural = 'Guruh talabalari'
        unique_together = ['group', 'student']

    def __str__(self):
        return f"{self.student} — {self.group}"
