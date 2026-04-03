from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """JWT token olishda qo'shimcha ma'lumotlar qaytarish."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['email'] = user.email
        token['role'] = user.role
        token['full_name'] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserListSerializer(self.user).data
        return data


class UserListSerializer(serializers.ModelSerializer):
    """Foydalanuvchi ro'yxat uchun serializer."""

    full_name = serializers.CharField(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'first_name', 'last_name',
            'full_name', 'role', 'role_display', 'avatar',
            'is_active', 'date_joined',
        ]


class UserDetailSerializer(serializers.ModelSerializer):
    """Foydalanuvchi batafsil serializer."""

    full_name = serializers.CharField(read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'first_name', 'last_name',
            'full_name', 'role', 'role_display', 'avatar',
            'is_active', 'date_joined', 'last_login',
        ]


class UserCreateSerializer(serializers.ModelSerializer):
    """Yangi foydalanuvchi yaratish serializer."""

    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email', 'phone', 'first_name', 'last_name',
            'role', 'password', 'password_confirm', 'avatar',
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs.pop('password_confirm'):
            raise serializers.ValidationError({
                'password_confirm': "Parollar mos kelmadi"
            })
        return attrs

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)


class UserUpdateSerializer(serializers.ModelSerializer):
    """Foydalanuvchi yangilash serializer."""

    class Meta:
        model = User
        fields = ['phone', 'first_name', 'last_name', 'avatar', 'is_active']


class ChangePasswordSerializer(serializers.Serializer):
    """Parol o'zgartirish serializer."""

    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Joriy parol noto'g'ri")
        return value

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                'new_password_confirm': "Yangi parollar mos kelmadi"
            })
        return attrs


class ProfileUpdateSerializer(serializers.ModelSerializer):
    """Profil yangilash (o'z profilini)."""

    class Meta:
        model = User
        fields = ['phone', 'first_name', 'last_name', 'avatar']
