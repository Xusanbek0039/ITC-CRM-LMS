from django_filters import rest_framework as filters

from .models import Lead


class LeadFilter(filters.FilterSet):
    """Leadlar filtrlash."""

    created_at_gte = filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    created_at_lte = filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Lead
        fields = ['status', 'source', 'course_interest', 'assigned_to']
