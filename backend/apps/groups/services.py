from django.utils import timezone
from rest_framework.exceptions import ValidationError

from .models import GroupStudent


def add_student_to_group(group, student_id):
    """Guruhga talaba qo'shish. max_students tekshiruvi bilan."""
    active_count = group.group_students.filter(status=GroupStudent.Status.ACTIVE).count()
    if active_count >= group.max_students:
        raise ValidationError({'detail': "Guruhda joy qolmagan (max_students cheklovi)"})

    if GroupStudent.objects.filter(group=group, student_id=student_id).exists():
        raise ValidationError({'detail': "Bu talaba allaqachon guruhda mavjud"})

    return GroupStudent.objects.create(group=group, student_id=student_id)


def remove_student_from_group(group, student_id):
    """Guruhdan talaba chiqarish."""
    try:
        gs = group.group_students.get(student_id=student_id)
    except GroupStudent.DoesNotExist:
        raise ValidationError({'detail': "Bu talaba guruhda topilmadi"})

    gs.status = GroupStudent.Status.LEFT
    gs.left_date = timezone.now().date()
    gs.save(update_fields=['status', 'left_date', 'updated_at'])
    return gs
