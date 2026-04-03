from rest_framework import serializers

from .models import Schedule
from .services import check_room_conflict, check_teacher_conflict


class _GroupShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()
    course_name = serializers.CharField(source='course.name')


class _RoomShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()


class ScheduleSerializer(serializers.ModelSerializer):
    """Jadval ro'yxat serializer."""

    group = _GroupShortSerializer(read_only=True)
    day_of_week_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    room = _RoomShortSerializer(read_only=True)
    teacher_name = serializers.CharField(source='group.teacher.user.full_name', read_only=True)

    class Meta:
        model = Schedule
        fields = [
            'id', 'group', 'day_of_week', 'day_of_week_display',
            'start_time', 'end_time', 'room', 'teacher_name',
        ]


class ScheduleCreateSerializer(serializers.ModelSerializer):
    """Jadval yaratish / yangilash serializer."""

    group_id = serializers.UUIDField(source='group.id')
    room_id = serializers.UUIDField(source='room.id', required=False, allow_null=True)

    class Meta:
        model = Schedule
        fields = ['group_id', 'day_of_week', 'start_time', 'end_time', 'room_id']

    def validate(self, attrs):
        group_data = attrs.get('group', {})
        room_data = attrs.get('room', {})
        group_id = group_data.get('id')
        room_id = room_data.get('id') if room_data else None
        day_of_week = attrs.get('day_of_week')
        start_time = attrs.get('start_time')
        end_time = attrs.get('end_time')
        exclude_id = self.instance.id if self.instance else None

        if start_time and end_time and start_time >= end_time:
            raise serializers.ValidationError(
                {'end_time': "Tugash vaqti boshlanish vaqtidan katta bo'lishi kerak"}
            )

        if room_id and day_of_week and start_time and end_time:
            if check_room_conflict(room_id, day_of_week, start_time, end_time, exclude_id):
                raise serializers.ValidationError(
                    {'room_id': "Bu xonada ushbu vaqtda boshqa dars mavjud"}
                )

        if group_id and day_of_week and start_time and end_time:
            from apps.groups.models import Group
            try:
                group = Group.objects.select_related('teacher').get(id=group_id)
            except Group.DoesNotExist:
                raise serializers.ValidationError({'group_id': "Guruh topilmadi"})

            if group.teacher_id:
                if check_teacher_conflict(
                    group.teacher_id, day_of_week, start_time, end_time, exclude_id
                ):
                    raise serializers.ValidationError(
                        {'group_id': "Bu o'qituvchining ushbu vaqtda boshqa darsi mavjud"}
                    )

        return attrs

    def create(self, validated_data):
        group_data = validated_data.pop('group')
        room_data = validated_data.pop('room', None)
        validated_data['group_id'] = group_data['id']
        if room_data:
            validated_data['room_id'] = room_data['id']
        return super().create(validated_data)

    def update(self, instance, validated_data):
        group_data = validated_data.pop('group', None)
        room_data = validated_data.pop('room', None)
        if group_data:
            validated_data['group_id'] = group_data['id']
        if room_data:
            validated_data['room_id'] = room_data['id']
        return super().update(instance, validated_data)
