from django.db import transaction

from apps.accounts.models import User
from apps.students.models import Student
from .models import Lead, LeadHistory


def create_lead(validated_data):
    """Yangi lead yaratish."""
    return Lead.objects.create(**validated_data)


def update_lead_status(lead, new_status, user, note=''):
    """Lead statusini yangilash va tarixga yozish."""
    old_status = lead.status
    lead.status = new_status
    lead.save(update_fields=['status', 'updated_at'])

    LeadHistory.objects.create(
        lead=lead,
        old_status=old_status,
        new_status=new_status,
        changed_by=user,
        note=note,
    )
    return lead


@transaction.atomic
def convert_lead_to_student(lead, user_data):
    """Leadni studentga aylantirish — User va Student yaratish."""
    group_id = user_data.pop('group_id', None)

    user = User.objects.create_user(
        email=user_data['email'],
        password=user_data['password'],
        first_name=user_data['first_name'],
        last_name=user_data['last_name'],
        phone=lead.phone,
        role='student',
    )

    student = Student.objects.create(
        user=user,
        parent_phone=user_data.get('parent_phone', ''),
        address=user_data.get('address', ''),
        birth_date=user_data.get('birth_date'),
    )

    if group_id:
        from apps.groups.models import GroupStudent
        GroupStudent.objects.create(group_id=group_id, student=student)

    update_lead_status(
        lead=lead,
        new_status=Lead.Status.ENROLLED,
        user=None,
        note=f"Studentga aylantirildi: {user.full_name}",
    )

    return student
