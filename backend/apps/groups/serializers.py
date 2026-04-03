from rest_framework import serializers

from .models import Room, Group, GroupStudent


class RoomSerializer(serializers.ModelSerializer):
    """Xona serializer."""

    class Meta:
        model = Room
        fields = '__all__'


class _CourseShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()


class _TeacherShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    full_name = serializers.CharField(source='user.full_name')


class _RoomShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()


class GroupListSerializer(serializers.ModelSerializer):
    """Guruhlar ro'yxati serializer."""

    course = _CourseShortSerializer(read_only=True)
    teacher = _TeacherShortSerializer(read_only=True)
    room = _RoomShortSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    students_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Group
        fields = [
            'id', 'name', 'course', 'teacher', 'room',
            'status', 'status_display', 'students_count',
            'start_date', 'lesson_days', 'lesson_start_time', 'lesson_end_time',
        ]


class _StudentShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    full_name = serializers.CharField(source='user.full_name')
    phone = serializers.CharField(source='user.phone')


class GroupStudentSerializer(serializers.ModelSerializer):
    """Guruh talabasi serializer."""

    student = _StudentShortSerializer(read_only=True)

    class Meta:
        model = GroupStudent
        fields = ['id', 'student', 'joined_date', 'left_date', 'status']


class GroupDetailSerializer(serializers.ModelSerializer):
    """Guruh batafsil serializer."""

    course = _CourseShortSerializer(read_only=True)
    teacher = _TeacherShortSerializer(read_only=True)
    room = _RoomShortSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    students_count = serializers.IntegerField(read_only=True)
    students = GroupStudentSerializer(source='group_students', many=True, read_only=True)

    class Meta:
        model = Group
        fields = [
            'id', 'name', 'course', 'teacher', 'room',
            'start_date', 'end_date', 'lesson_days',
            'lesson_start_time', 'lesson_end_time',
            'status', 'status_display', 'max_students',
            'students_count', 'students',
            'created_at', 'updated_at',
        ]


class GroupCreateSerializer(serializers.ModelSerializer):
    """Guruh yaratish / yangilash serializer."""

    course_id = serializers.UUIDField(source='course.id')
    teacher_id = serializers.UUIDField(source='teacher.id', required=False, allow_null=True)
    room_id = serializers.UUIDField(source='room.id', required=False, allow_null=True)

    class Meta:
        model = Group
        fields = [
            'name', 'course_id', 'teacher_id', 'room_id',
            'start_date', 'end_date', 'lesson_days',
            'lesson_start_time', 'lesson_end_time',
            'max_students', 'status',
        ]

    def create(self, validated_data):
        course_data = validated_data.pop('course')
        teacher_data = validated_data.pop('teacher', None)
        room_data = validated_data.pop('room', None)
        validated_data['course_id'] = course_data['id']
        if teacher_data:
            validated_data['teacher_id'] = teacher_data['id']
        if room_data:
            validated_data['room_id'] = room_data['id']
        return super().create(validated_data)

    def update(self, instance, validated_data):
        course_data = validated_data.pop('course', None)
        teacher_data = validated_data.pop('teacher', None)
        room_data = validated_data.pop('room', None)
        if course_data:
            validated_data['course_id'] = course_data['id']
        if teacher_data:
            validated_data['teacher_id'] = teacher_data['id']
        if room_data:
            validated_data['room_id'] = room_data['id']
        return super().update(instance, validated_data)


class AddStudentSerializer(serializers.Serializer):
    """Guruhga talaba qo'shish."""

    student_id = serializers.UUIDField()


class RemoveStudentSerializer(serializers.Serializer):
    """Guruhdan talaba chiqarish."""

    student_id = serializers.UUIDField()
