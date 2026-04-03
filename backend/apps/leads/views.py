from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsManager
from core.mixins import SoftDeleteMixin
from .models import Lead
from .serializers import (
    LeadListSerializer,
    LeadDetailSerializer,
    LeadCreateSerializer,
    LeadUpdateSerializer,
    LeadHistorySerializer,
    LeadConvertSerializer,
)
from .filters import LeadFilter
from .services import convert_lead_to_student


class LeadViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    """Leadlar CRUD."""

    permission_classes = [IsAuthenticated, IsManager]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = LeadFilter
    search_fields = ['full_name', 'phone', 'notes']
    ordering_fields = ['created_at', 'full_name']
    ordering = ['-created_at']

    def get_queryset(self):
        return Lead.objects.select_related('course_interest', 'assigned_to').all()

    def get_serializer_class(self):
        if self.action == 'create':
            return LeadCreateSerializer
        if self.action in ('update', 'partial_update'):
            return LeadUpdateSerializer
        if self.action == 'retrieve':
            return LeadDetailSerializer
        if self.action == 'convert':
            return LeadConvertSerializer
        return LeadListSerializer

    @action(detail=True, methods=['post'])
    def convert(self, request, pk=None):
        """Leadni studentga aylantirish."""
        lead = self.get_object()
        serializer = LeadConvertSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        student = convert_lead_to_student(lead, serializer.validated_data)
        return Response(
            {
                'success': True,
                'message': "Lead muvaffaqiyatli studentga aylantirildi",
                'data': {
                    'student_id': str(student.id),
                    'user_id': str(student.user_id),
                },
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['get'])
    def history(self, request, pk=None):
        """Lead status o'zgarish tarixi."""
        lead = self.get_object()
        history = lead.history.select_related('changed_by').all()
        serializer = LeadHistorySerializer(history, many=True)
        return Response(serializer.data)
