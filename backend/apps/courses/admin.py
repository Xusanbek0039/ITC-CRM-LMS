from django.contrib import admin

from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'duration_months', 'price', 'payment_type', 'is_active', 'created_at')
    list_filter = ('is_active', 'payment_type')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    list_editable = ('is_active',)
