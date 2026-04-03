from collections import OrderedDict

from django.db.models import Q

from .models import Schedule


def check_room_conflict(room_id, day_of_week, start_time, end_time, exclude_id=None):
    """Xonada vaqt konflikti bor-yo'qligini tekshiradi."""
    qs = Schedule.objects.filter(
        room_id=room_id,
        day_of_week=day_of_week,
    ).filter(
        Q(start_time__lt=end_time) & Q(end_time__gt=start_time),
    )
    if exclude_id:
        qs = qs.exclude(id=exclude_id)
    return qs.exists()


def check_teacher_conflict(teacher_id, day_of_week, start_time, end_time, exclude_id=None):
    """O'qituvchida vaqt konflikti bor-yo'qligini tekshiradi."""
    qs = Schedule.objects.filter(
        group__teacher_id=teacher_id,
        day_of_week=day_of_week,
    ).filter(
        Q(start_time__lt=end_time) & Q(end_time__gt=start_time),
    )
    if exclude_id:
        qs = qs.exclude(id=exclude_id)
    return qs.exists()


def get_weekly_schedule(filters=None):
    """Haftalik jadvalni kun bo'yicha guruhlangan holda qaytaradi."""
    qs = Schedule.objects.select_related(
        'group__course', 'group__teacher__user', 'room',
    )
    if filters:
        qs = qs.filter(**filters)

    days_order = [c[0] for c in Schedule.DayOfWeek.choices]
    result = OrderedDict((day, []) for day in days_order)

    for schedule in qs:
        result[schedule.day_of_week].append(schedule)

    return result


def get_room_availability(room_id):
    """Xonaning band vaqtlarini kun bo'yicha qaytaradi."""
    qs = Schedule.objects.filter(room_id=room_id).order_by('day_of_week', 'start_time')

    days_order = [c[0] for c in Schedule.DayOfWeek.choices]
    result = OrderedDict((day, []) for day in days_order)

    for schedule in qs:
        result[schedule.day_of_week].append({
            'start_time': schedule.start_time,
            'end_time': schedule.end_time,
            'group': schedule.group.name,
        })

    return result
