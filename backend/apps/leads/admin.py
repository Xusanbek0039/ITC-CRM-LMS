from django.contrib import admin

from .models import Lead, LeadHistory


class LeadHistoryInline(admin.TabularInline):
    model = LeadHistory
    extra = 0
    readonly_fields = ('old_status', 'new_status', 'changed_by', 'note', 'created_at')


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'phone', 'source', 'status', 'course_interest', 'assigned_to', 'created_at')
    list_filter = ('status', 'source', 'course_interest')
    search_fields = ('full_name', 'phone', 'notes')
    raw_id_fields = ('course_interest', 'assigned_to')
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)
    inlines = [LeadHistoryInline]


@admin.register(LeadHistory)
class LeadHistoryAdmin(admin.ModelAdmin):
    list_display = ('lead', 'old_status', 'new_status', 'changed_by', 'created_at')
    list_filter = ('new_status',)
    search_fields = ('lead__full_name',)
    raw_id_fields = ('lead', 'changed_by')
    readonly_fields = ('created_at',)
    ordering = ('-created_at',)
