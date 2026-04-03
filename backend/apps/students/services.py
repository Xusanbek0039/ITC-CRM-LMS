from django.db import transaction

from apps.accounts.models import User
from .models import Student


@transaction.atomic
def create_student(validated_data):
    """User va Student yaratish."""
    user_data = {
        'email': validated_data.pop('email'),
        'first_name': validated_data.pop('first_name'),
        'last_name': validated_data.pop('last_name'),
        'password': validated_data.pop('password'),
        'role': 'student',
    }
    phone = validated_data.pop('phone', None)
    if phone:
        user_data['phone'] = phone

    user = User.objects.create_user(**user_data)
    student = Student.objects.create(user=user, **validated_data)
    return student


@transaction.atomic
def update_student(student, validated_data):
    """User va Student yangilash."""
    user_fields = {}
    for field in ('phone', 'first_name', 'last_name'):
        if field in validated_data:
            user_fields[field] = validated_data.pop(field)

    if user_fields:
        User.objects.filter(pk=student.user_id).update(**user_fields)
        student.user.refresh_from_db()

    for attr, value in validated_data.items():
        setattr(student, attr, value)
    student.save()

    return student


def freeze_student(student):
    """O'quvchini muzlatish."""
    student.status = Student.Status.FROZEN
    student.save(update_fields=['status', 'updated_at'])
    return student


def activate_student(student):
    """O'quvchini faollashtirish."""
    student.status = Student.Status.ACTIVE
    student.save(update_fields=['status', 'updated_at'])
    return student
