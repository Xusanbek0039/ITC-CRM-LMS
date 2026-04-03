from django_filters import rest_framework as filters

from .models import Payment


class PaymentFilter(filters.FilterSet):
    """To'lovlar filtrlash."""

    student = filters.UUIDFilter(field_name='student_id')
    group = filters.UUIDFilter(field_name='group_id')
    payment_type = filters.ChoiceFilter(choices=Payment.PaymentType.choices)
    payment_date_gte = filters.DateFilter(field_name='payment_date', lookup_expr='gte')
    payment_date_lte = filters.DateFilter(field_name='payment_date', lookup_expr='lte')
    period_month = filters.DateFilter(field_name='period_month')

    class Meta:
        model = Payment
        fields = [
            'student', 'group', 'payment_type',
            'payment_date_gte', 'payment_date_lte', 'period_month',
        ]
