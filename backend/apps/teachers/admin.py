from django.contrib import admin
from .models import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'work_start_time', 'work_end_time', 'created_at')
    list_filter = ('specialization', 'user__is_active')
    search_fields = ('user__first_name', 'user__last_name', 'user__email', 'user__phone', 'specialization')
    raw_id_fields = ('user',)
    filter_horizontal = ('subjects',)
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
