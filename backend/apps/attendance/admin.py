from django.contrib import admin

from .models import Attendance, AttendanceRecord


class AttendanceRecordInline(admin.TabularInline):
    model = AttendanceRecord
    extra = 0


@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ('group', 'date', 'created_by', 'created_at')
    list_filter = ('date', 'group')
    search_fields = ('group__name',)
    inlines = [AttendanceRecordInline]


@admin.register(AttendanceRecord)
class AttendanceRecordAdmin(admin.ModelAdmin):
    list_display = ('attendance', 'student', 'status')
    list_filter = ('status',)
    search_fields = ('student__user__first_name', 'student__user__last_name')
