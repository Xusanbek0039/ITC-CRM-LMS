from django.db import transaction
from django.db.models import Count, Q

from .models import Attendance, AttendanceRecord


def create_attendance(validated_data, user):
    """Davomat + yozuvlarni yaratish (transaction bilan)."""
    with transaction.atomic():
        attendance = Attendance.objects.create(
            group_id=validated_data['group_id'],
            date=validated_data['date'],
            created_by=user,
        )
        records = [
            AttendanceRecord(
                attendance=attendance,
                student_id=record['student_id'],
                status=record['status'],
                note=record.get('note', ''),
            )
            for record in validated_data['records']
        ]
        AttendanceRecord.objects.bulk_create(records)
    return attendance


def get_attendance_stats(group_id=None, student_id=None, date_from=None, date_to=None):
    """Davomat statistikasi."""
    qs = AttendanceRecord.objects.all()

    if group_id:
        qs = qs.filter(attendance__group_id=group_id)
    if student_id:
        qs = qs.filter(student_id=student_id)
    if date_from:
        qs = qs.filter(attendance__date__gte=date_from)
    if date_to:
        qs = qs.filter(attendance__date__lte=date_to)

    stats = qs.aggregate(
        total=Count('id'),
        present=Count('id', filter=Q(status=AttendanceRecord.Status.PRESENT)),
        absent=Count('id', filter=Q(status=AttendanceRecord.Status.ABSENT)),
        late=Count('id', filter=Q(status=AttendanceRecord.Status.LATE)),
        excused=Count('id', filter=Q(status=AttendanceRecord.Status.EXCUSED)),
    )

    total = stats['total']
    stats['attendance_rate'] = round(
        (stats['present'] + stats['late']) / total * 100, 1
    ) if total > 0 else 0

    return stats
