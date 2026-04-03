from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('user', 'parent_phone', 'status', 'enrolled_date', 'created_at')
    list_filter = ('status', 'enrolled_date')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'user__phone', 'parent_phone')
    raw_id_fields = ('user',)
    readonly_fields = ('enrolled_date', 'created_at', 'updated_at')
    ordering = ('-created_at',)
