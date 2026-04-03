from rest_framework import serializers

from .models import Attendance, AttendanceRecord


class _StudentShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    full_name = serializers.CharField(source='user.full_name')


class _GroupShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()


class AttendanceRecordSerializer(serializers.ModelSerializer):
    """Davomat yozuvi serializer."""

    student = _StudentShortSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = AttendanceRecord
        fields = ['id', 'student', 'status', 'status_display', 'note']


class AttendanceListSerializer(serializers.ModelSerializer):
    """Davomatlar ro'yxati serializer."""

    group = _GroupShortSerializer(read_only=True)
    created_by = serializers.CharField(source='created_by.full_name', read_only=True, default=None)
    records_summary = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = ['id', 'group', 'date', 'created_by', 'records_summary', 'created_at']

    def get_records_summary(self, obj):
        records = obj.records.all()
        return {
            'present_count': records.filter(status=AttendanceRecord.Status.PRESENT).count(),
            'absent_count': records.filter(status=AttendanceRecord.Status.ABSENT).count(),
            'late_count': records.filter(status=AttendanceRecord.Status.LATE).count(),
            'excused_count': records.filter(status=AttendanceRecord.Status.EXCUSED).count(),
        }


class AttendanceDetailSerializer(serializers.ModelSerializer):
    """Davomat batafsil serializer."""

    group = _GroupShortSerializer(read_only=True)
    created_by = serializers.CharField(source='created_by.full_name', read_only=True, default=None)
    records = AttendanceRecordSerializer(many=True, read_only=True)

    class Meta:
        model = Attendance
        fields = ['id', 'group', 'date', 'created_by', 'records', 'created_at']


class _AttendanceRecordInputSerializer(serializers.Serializer):
    student_id = serializers.UUIDField()
    status = serializers.ChoiceField(
        choices=AttendanceRecord.Status.choices,
        default=AttendanceRecord.Status.PRESENT,
    )
    note = serializers.CharField(required=False, default='', allow_blank=True)


class AttendanceCreateSerializer(serializers.Serializer):
    """Davomat yaratish serializer."""

    group_id = serializers.UUIDField()
    date = serializers.DateField()
    records = _AttendanceRecordInputSerializer(many=True)

    def validate_group_id(self, value):
        from apps.groups.models import Group
        try:
            Group.objects.get(pk=value)
        except Group.DoesNotExist:
            raise serializers.ValidationError("Guruh topilmadi")
        return value

    def validate(self, attrs):
        from apps.groups.models import GroupStudent
        group_id = attrs['group_id']

        if Attendance.objects.filter(group_id=group_id, date=attrs['date']).exists():
            raise serializers.ValidationError(
                {'date': "Bu guruh uchun shu sanada davomat allaqachon mavjud"}
            )

        active_student_ids = set(
            GroupStudent.objects.filter(
                group_id=group_id,
                status=GroupStudent.Status.ACTIVE,
            ).values_list('student_id', flat=True)
        )

        for record in attrs['records']:
            if record['student_id'] not in active_student_ids:
                raise serializers.ValidationError(
                    {'records': f"Talaba {record['student_id']} bu guruhda faol emas"}
                )

        return attrs

    def create(self, validated_data):
        from .services import create_attendance
        return create_attendance(validated_data, self.context['request'].user)
