from django_filters import rest_framework as filters

from .models import Attendance


class AttendanceFilter(filters.FilterSet):
    """Davomat uchun filter."""

    group = filters.UUIDFilter(field_name='group_id')
    date = filters.DateFilter(field_name='date')
    date_gte = filters.DateFilter(field_name='date', lookup_expr='gte')
    date_lte = filters.DateFilter(field_name='date', lookup_expr='lte')
    created_by = filters.UUIDFilter(field_name='created_by_id')

    class Meta:
        model = Attendance
        fields = ['group', 'date', 'date_gte', 'date_lte', 'created_by']
