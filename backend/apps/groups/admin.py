from django.contrib import admin

from .models import Room, Group, GroupStudent


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'capacity', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)


class GroupStudentInline(admin.TabularInline):
    model = GroupStudent
    extra = 0
    readonly_fields = ('joined_date',)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'course', 'teacher', 'status', 'start_date', 'max_students')
    list_filter = ('status', 'course')
    search_fields = ('name', 'course__name')
    inlines = [GroupStudentInline]


@admin.register(GroupStudent)
class GroupStudentAdmin(admin.ModelAdmin):
    list_display = ('group', 'student', 'status', 'joined_date', 'left_date')
    list_filter = ('status',)
    search_fields = ('group__name', 'student__user__first_name', 'student__user__last_name')
