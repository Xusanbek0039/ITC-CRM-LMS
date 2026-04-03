from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsManager
from core.mixins import SoftDeleteMixin
from .models import Student
from .serializers import (
    StudentListSerializer,
    StudentDetailSerializer,
    StudentCreateSerializer,
    StudentUpdateSerializer,
)
from .filters import StudentFilter
from .services import freeze_student, activate_student


class StudentViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    """O'quvchilar CRUD."""

    permission_classes = [IsAuthenticated, IsManager]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = StudentFilter
    search_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'user__phone', 'parent_phone',
    ]
    ordering_fields = ['user__first_name', 'enrolled_date', 'created_at']

    def get_queryset(self):
        return Student.objects.select_related('user').all()

    def get_serializer_class(self):
        if self.action == 'create':
            return StudentCreateSerializer
        if self.action in ('update', 'partial_update'):
            return StudentUpdateSerializer
        if self.action == 'retrieve':
            return StudentDetailSerializer
        return StudentListSerializer

    @action(detail=True, methods=['post'])
    def freeze(self, request, pk=None):
        """O'quvchini muzlatish."""
        student = self.get_object()
        freeze_student(student)
        return Response(
            {'success': True, 'message': "O'quvchi muzlatildi"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """O'quvchini faollashtirish."""
        student = self.get_object()
        activate_student(student)
        return Response(
            {'success': True, 'message': "O'quvchi faollashtirildi"},
            status=status.HTTP_200_OK,
        )

    @action(detail=True, methods=['get'])
    def groups(self, request, pk=None):
        """O'quvchi guruhlari."""
        student = self.get_object()
        group_students = student.group_students.select_related('group').all()
        data = [
            {
                'id': gs.group.id,
                'name': str(gs.group),
                'joined_date': gs.joined_date,
            }
            for gs in group_students
        ]
        return Response(data)

    @action(detail=True, methods=['get'])
    def payments(self, request, pk=None):
        """O'quvchi to'lovlari tarixi."""
        student = self.get_object()
        payments = student.payments.all()
        data = [
            {
                'id': p.id,
                'amount': p.amount,
                'status': p.status,
                'created_at': p.created_at,
            }
            for p in payments
        ]
        return Response(data)

    @action(detail=True, methods=['get'])
    def attendance(self, request, pk=None):
        """O'quvchi davomati tarixi."""
        student = self.get_object()
        records = student.attendances.all()
        data = [
            {
                'id': r.id,
                'date': r.date,
                'status': r.status,
                'created_at': r.created_at,
            }
            for r in records
        ]
        return Response(data)
