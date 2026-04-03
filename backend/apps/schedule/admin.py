from django.contrib import admin

from .models import Schedule


@admin.register(Schedule)
class ScheduleAdmin(admin.ModelAdmin):
    list_display = ('group', 'day_of_week', 'start_time', 'end_time', 'room')
    list_filter = ('day_of_week', 'room')
    search_fields = ('group__name', 'room__name')
