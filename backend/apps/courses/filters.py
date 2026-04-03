from django_filters import rest_framework as filters

from .models import Course


class CourseFilter(filters.FilterSet):
    """Kurslar uchun filter."""

    min_price = filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_duration = filters.NumberFilter(field_name='duration_months', lookup_expr='gte')
    max_duration = filters.NumberFilter(field_name='duration_months', lookup_expr='lte')

    class Meta:
        model = Course
        fields = ['is_active', 'payment_type']
