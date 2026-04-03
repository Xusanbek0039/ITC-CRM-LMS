from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsManager
from core.mixins import SoftDeleteMixin
from .models import Payment
from .serializers import (
    PaymentListSerializer,
    PaymentDetailSerializer,
    PaymentCreateSerializer,
    PaymentUpdateSerializer,
)
from .filters import PaymentFilter
from .services import get_debtors, get_monthly_report


class PaymentViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    """To'lovlar CRUD + qarzdorlar va oylik hisobot."""

    permission_classes = [IsAuthenticated, IsManager]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = PaymentFilter
    search_fields = ['student__user__first_name', 'student__user__last_name']
    ordering_fields = ['payment_date', 'amount', 'created_at']

    def get_queryset(self):
        return Payment.objects.select_related(
            'student__user', 'group', 'created_by',
        ).all()

    def get_serializer_class(self):
        if self.action == 'create':
            return PaymentCreateSerializer
        if self.action in ('update', 'partial_update'):
            return PaymentUpdateSerializer
        if self.action == 'retrieve':
            return PaymentDetailSerializer
        return PaymentListSerializer

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    @action(detail=False, methods=['get'])
    def debtors(self, request):
        """Qarzdor talabalar ro'yxati."""
        data = get_debtors()
        return Response(data)

    @action(detail=False, methods=['get'])
    def monthly_report(self, request):
        """Oylik to'lov hisoboti."""
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        if not year or not month:
            return Response(
                {'detail': "year va month parametrlari majburiy"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            year = int(year)
            month = int(month)
        except (ValueError, TypeError):
            return Response(
                {'detail': "year va month butun son bo'lishi kerak"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        data = get_monthly_report(year, month)
        return Response(data)
