from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password

from apps.accounts.models import User
from .models import Student


class StudentUserSerializer(serializers.ModelSerializer):
    """O'quvchi ichidagi user ma'lumotlari."""

    full_name = serializers.CharField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'avatar']


class StudentListSerializer(serializers.ModelSerializer):
    """O'quvchilar ro'yxati uchun serializer."""

    user = StudentUserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Student
        fields = [
            'id', 'user', 'parent_phone', 'status',
            'status_display', 'enrolled_date',
        ]


class StudentDetailSerializer(serializers.ModelSerializer):
    """O'quvchi batafsil serializer."""

    user = StudentUserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    groups = serializers.SerializerMethodField()
    payments_summary = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            'id', 'user', 'parent_phone', 'address', 'birth_date',
            'status', 'status_display', 'notes', 'enrolled_date',
            'groups', 'payments_summary',
            'created_at', 'updated_at',
        ]

    def get_groups(self, obj):
        group_students = obj.group_students.select_related('group').all()
        return [
            {
                'id': gs.group.id,
                'name': str(gs.group),
                'joined_date': gs.joined_date,
            }
            for gs in group_students
        ]

    def get_payments_summary(self, obj):
        payments = obj.payments.all()
        total_paid = sum(p.amount for p in payments if p.status == 'paid')
        total_debt = sum(p.amount for p in payments if p.status == 'pending')
        return {
            'total_paid': total_paid,
            'total_debt': total_debt,
        }


class StudentCreateSerializer(serializers.ModelSerializer):
    """Yangi o'quvchi yaratish serializer."""

    email = serializers.EmailField(write_only=True)
    phone = serializers.CharField(max_length=20, required=False, allow_blank=True, write_only=True)
    first_name = serializers.CharField(max_length=150, write_only=True)
    last_name = serializers.CharField(max_length=150, write_only=True)
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = Student
        fields = [
            'email', 'phone', 'first_name', 'last_name', 'password',
            'parent_phone', 'address', 'birth_date', 'notes',
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
        from .services import create_student
        return create_student(validated_data)


class StudentUpdateSerializer(serializers.ModelSerializer):
    """O'quvchi yangilash serializer."""

    phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)

    class Meta:
        model = Student
        fields = [
            'phone', 'first_name', 'last_name',
            'parent_phone', 'address', 'birth_date', 'notes',
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
        from .services import update_student
        return update_student(instance, validated_data)
