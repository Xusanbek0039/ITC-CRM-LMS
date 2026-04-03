from rest_framework import serializers

from .models import Lead, LeadHistory


class LeadHistorySerializer(serializers.ModelSerializer):
    """Lead tarix serializer."""

    changed_by = serializers.CharField(source='changed_by.full_name', read_only=True)

    class Meta:
        model = LeadHistory
        fields = ['id', 'old_status', 'new_status', 'changed_by', 'note', 'created_at']


class CourseShortSerializer(serializers.Serializer):
    """Kurs qisqacha serializer (lead ichida)."""

    id = serializers.UUIDField(read_only=True)
    name = serializers.CharField(read_only=True)


class AssignedUserSerializer(serializers.Serializer):
    """Mas'ul xodim qisqacha serializer."""

    id = serializers.UUIDField(read_only=True)
    full_name = serializers.CharField(read_only=True)


class LeadListSerializer(serializers.ModelSerializer):
    """Leadlar ro'yxati uchun serializer."""

    source_display = serializers.CharField(source='get_source_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    course_interest = CourseShortSerializer(read_only=True)
    assigned_to = AssignedUserSerializer(read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'full_name', 'phone', 'source', 'source_display',
            'course_interest', 'status', 'status_display',
            'assigned_to', 'created_at',
        ]


class LeadDetailSerializer(serializers.ModelSerializer):
    """Lead batafsil serializer."""

    source_display = serializers.CharField(source='get_source_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    course_interest = CourseShortSerializer(read_only=True)
    assigned_to = AssignedUserSerializer(read_only=True)
    history = LeadHistorySerializer(many=True, read_only=True)

    class Meta:
        model = Lead
        fields = [
            'id', 'full_name', 'phone', 'source', 'source_display',
            'course_interest', 'status', 'status_display',
            'assigned_to', 'notes', 'history',
            'created_at', 'updated_at',
        ]


class LeadCreateSerializer(serializers.ModelSerializer):
    """Lead yaratish serializer."""

    class Meta:
        model = Lead
        fields = [
            'full_name', 'phone', 'source', 'course_interest',
            'status', 'assigned_to', 'notes',
        ]


class LeadUpdateSerializer(serializers.ModelSerializer):
    """Lead yangilash serializer."""

    class Meta:
        model = Lead
        fields = [
            'full_name', 'phone', 'source', 'course_interest',
            'status', 'assigned_to', 'notes',
        ]

    def update(self, instance, validated_data):
        new_status = validated_data.get('status')
        old_status = instance.status

        instance = super().update(instance, validated_data)

        if new_status and new_status != old_status:
            request = self.context.get('request')
            LeadHistory.objects.create(
                lead=instance,
                old_status=old_status,
                new_status=new_status,
                changed_by=request.user if request else None,
                note=f"Status {old_status} dan {new_status} ga o'zgartirildi",
            )

        return instance


class LeadConvertSerializer(serializers.Serializer):
    """Leadni studentga aylantirish uchun serializer."""

    email = serializers.EmailField()
    first_name = serializers.CharField(max_length=150)
    last_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True)
    parent_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    address = serializers.CharField(required=False, allow_blank=True)
    birth_date = serializers.DateField(required=False, allow_null=True)
    group_id = serializers.UUIDField(required=False, allow_null=True)
