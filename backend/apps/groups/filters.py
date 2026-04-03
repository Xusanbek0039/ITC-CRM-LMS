from django_filters import rest_framework as filters

from .models import Group


class GroupFilter(filters.FilterSet):
    """Guruhlar uchun filter."""

    course = filters.UUIDFilter(field_name='course_id')
    teacher = filters.UUIDFilter(field_name='teacher_id')
    room = filters.UUIDFilter(field_name='room_id')
    status = filters.CharFilter(field_name='status')

    class Meta:
        model = Group
        fields = ['course', 'teacher', 'room', 'status']
