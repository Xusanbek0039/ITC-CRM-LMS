from django.db import transaction

from apps.accounts.models import User
from .models import Teacher


@transaction.atomic
def create_teacher(validated_data):
    """User va Teacher yaratish."""
    user_data = {
        'email': validated_data.pop('email'),
        'first_name': validated_data.pop('first_name'),
        'last_name': validated_data.pop('last_name'),
        'password': validated_data.pop('password'),
        'role': 'teacher',
    }
    phone = validated_data.pop('phone', None)
    if phone:
        user_data['phone'] = phone

    user = User.objects.create_user(**user_data)
    teacher = Teacher.objects.create(user=user, **validated_data)
    return teacher


@transaction.atomic
def update_teacher(teacher, validated_data):
    """User va Teacher yangilash."""
    user_fields = {}
    for field in ('phone', 'first_name', 'last_name'):
        if field in validated_data:
            user_fields[field] = validated_data.pop(field)

    if user_fields:
        User.objects.filter(pk=teacher.user_id).update(**user_fields)
        teacher.user.refresh_from_db()

    for attr, value in validated_data.items():
        setattr(teacher, attr, value)
    teacher.save()

    return teacher
