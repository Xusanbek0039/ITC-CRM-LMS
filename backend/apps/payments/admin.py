from django.contrib import admin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'student', 'group', 'amount', 'discount',
        'payment_type', 'payment_date', 'period_month', 'created_by',
    )
    list_filter = ('payment_type', 'payment_date', 'period_month')
    search_fields = (
        'student__user__first_name', 'student__user__last_name',
        'student__user__email', 'group__name',
    )
    raw_id_fields = ('student', 'group', 'created_by')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
