from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from apps.accounts.models import User
from .models import Teacher


class TeacherUserSerializer(serializers.ModelSerializer):
    """O'qituvchi ichidagi user ma'lumotlari."""

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'avatar']


class TeacherListSerializer(serializers.ModelSerializer):
    """O'qituvchilar ro'yxati uchun serializer."""

    user = TeacherUserSerializer(read_only=True)
    subjects = serializers.StringRelatedField(many=True, read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'specialization', 'subjects', 'is_active',
        ]


class TeacherDetailSerializer(serializers.ModelSerializer):
    """O'qituvchi batafsil serializer."""

    user = TeacherUserSerializer(read_only=True)
    subjects = serializers.StringRelatedField(many=True, read_only=True)
    is_active = serializers.BooleanField(source='user.is_active', read_only=True)
    groups_count = serializers.SerializerMethodField()

    class Meta:
        model = Teacher
        fields = [
            'id', 'user', 'specialization', 'subjects',
            'work_start_time', 'work_end_time', 'work_days',
            'bio', 'is_active', 'groups_count',
            'created_at', 'updated_at',
        ]

    def get_groups_count(self, obj):
        return obj.groups.count()


class TeacherCreateSerializer(serializers.ModelSerializer):
    """Yangi o'qituvchi yaratish serializer."""

    email = serializers.EmailField(write_only=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, write_only=True)
    first_name = serializers.CharField(max_length=150, write_only=True)
    last_name = serializers.CharField(max_length=150, write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = Teacher
        fields = [
            'email', 'phone', 'first_name', 'last_name', 'password',
            'specialization', 'work_start_time', 'work_end_time',
            'work_days', 'bio',
        ]

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Bu email allaqachon ro'yxatdan o'tgan")
        return value

    def validate_phone(self, value):
        if value and User.objects.filter(phone=value).exists():
            raise serializers.ValidationError("Bu telefon raqam allaqachon ro'yxatdan o'tgan")
        return value

    def create(self, validated_data):
        from .services import create_teacher
        return create_teacher(validated_data)


class TeacherUpdateSerializer(serializers.ModelSerializer):
    """O'qituvchi yangilash serializer."""

    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)

    class Meta:
        model = Teacher
        fields = [
            'phone', 'first_name', 'last_name',
            'specialization', 'work_start_time', 'work_end_time',
            'work_days', 'bio',
        ]

    def validate_phone(self, value):
        if value:
            existing = User.objects.filter(phone=value).exclude(
                pk=self.instance.user_id
            )
            if existing.exists():
                raise serializers.ValidationError("Bu telefon raqam allaqachon ro'yxatdan o'tgan")
        return value

    def update(self, instance, validated_data):
        from .services import update_teacher
        return update_teacher(instance, validated_data)
