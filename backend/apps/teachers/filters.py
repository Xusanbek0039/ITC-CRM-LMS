from django_filters import rest_framework as filters
from .models import Teacher


class TeacherFilter(filters.FilterSet):
    """O'qituvchilar filtrlash."""

    specialization = filters.CharFilter(lookup_expr='icontains')
    is_active = filters.BooleanFilter(field_name='user__is_active')

    class Meta:
        model = Teacher
        fields = ['specialization', 'is_active']
