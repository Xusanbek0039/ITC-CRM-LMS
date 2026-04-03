from rest_framework import serializers

from .models import Payment


class _StudentShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    full_name = serializers.CharField(source='user.full_name')


class _GroupShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    name = serializers.CharField()


class _UserShortSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    full_name = serializers.CharField()


class PaymentListSerializer(serializers.ModelSerializer):
    """To'lovlar ro'yxati serializer."""

    student = _StudentShortSerializer(read_only=True)
    group = _GroupShortSerializer(read_only=True)
    net_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    payment_type_display = serializers.CharField(source='get_payment_type_display', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'student', 'group', 'amount', 'discount',
            'net_amount', 'payment_type', 'payment_type_display',
            'payment_date', 'period_month',
        ]


class PaymentDetailSerializer(serializers.ModelSerializer):
    """To'lov batafsil serializer."""

    student = _StudentShortSerializer(read_only=True)
    group = _GroupShortSerializer(read_only=True)
    created_by = _UserShortSerializer(read_only=True)
    net_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    payment_type_display = serializers.CharField(source='get_payment_type_display', read_only=True)

    class Meta:
        model = Payment
        fields = [
            'id', 'student', 'group', 'amount', 'discount',
            'net_amount', 'payment_type', 'payment_type_display',
            'payment_date', 'period_month', 'note',
            'created_by', 'created_at', 'updated_at',
        ]


class PaymentCreateSerializer(serializers.ModelSerializer):
    """Yangi to'lov yaratish serializer."""

    student_id = serializers.UUIDField()
    group_id = serializers.UUIDField(required=False, allow_null=True)

    class Meta:
        model = Payment
        fields = [
            'student_id', 'group_id', 'amount', 'discount',
            'payment_type', 'payment_date', 'period_month', 'note',
        ]

    def validate(self, attrs):
        if attrs.get('discount', 0) > attrs.get('amount', 0):
            raise serializers.ValidationError(
                {'discount': "Chegirma to'lov summasidan oshmasligi kerak"}
            )
        return attrs

    def create(self, validated_data):
        from .services import create_payment
        user = self.context['request'].user
        return create_payment(validated_data, user)


class PaymentUpdateSerializer(serializers.ModelSerializer):
    """To'lov yangilash serializer."""

    class Meta:
        model = Payment
        fields = ['amount', 'discount', 'payment_type', 'payment_date', 'note']

    def validate(self, attrs):
        amount = attrs.get('amount', self.instance.amount)
        discount = attrs.get('discount', self.instance.discount)
        if discount > amount:
            raise serializers.ValidationError(
                {'discount': "Chegirma to'lov summasidan oshmasligi kerak"}
            )
        return attrs
