from django_filters import rest_framework as filters
from .models import Student


class StudentFilter(filters.FilterSet):
    """O'quvchilar filtrlash."""

    status = filters.ChoiceFilter(choices=Student.Status.choices)
    enrolled_date_from = filters.DateFilter(field_name='enrolled_date', lookup_expr='gte')
    enrolled_date_to = filters.DateFilter(field_name='enrolled_date', lookup_expr='lte')

    class Meta:
        model = Student
        fields = ['status', 'enrolled_date_from', 'enrolled_date_to']
