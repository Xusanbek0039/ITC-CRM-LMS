from django_filters import rest_framework as filters

from .models import Schedule


class ScheduleFilter(filters.FilterSet):
    """Jadval uchun filter."""

    group = filters.UUIDFilter(field_name='group_id')
    room = filters.UUIDFilter(field_name='room_id')
    day_of_week = filters.CharFilter(field_name='day_of_week')

    class Meta:
        model = Schedule
        fields = ['group', 'room', 'day_of_week']
