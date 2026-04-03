from rest_framework import serializers

from .models import Course


class CourseListSerializer(serializers.ModelSerializer):
    """Kurslar ro'yxati uchun serializer."""

    payment_type_display = serializers.CharField(
        source='get_payment_type_display', read_only=True
    )

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'description', 'duration_months',
            'price', 'payment_type', 'payment_type_display',
            'is_active', 'created_at', 'updated_at',
        ]


class CourseDetailSerializer(serializers.ModelSerializer):
    """Kurs batafsil serializer."""

    payment_type_display = serializers.CharField(
        source='get_payment_type_display', read_only=True
    )

    class Meta:
        model = Course
        fields = [
            'id', 'name', 'description', 'duration_months',
            'price', 'payment_type', 'payment_type_display',
            'is_active', 'created_at', 'updated_at',
        ]


class CourseCreateUpdateSerializer(serializers.ModelSerializer):
    """Kurs yaratish va yangilash uchun serializer."""

    class Meta:
        model = Course
        fields = [
            'name', 'description', 'duration_months',
            'price', 'payment_type', 'is_active',
        ]
