from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsAdmin, IsManager, IsTeacher
from core.mixins import SoftDeleteMixin
from .models import Teacher
from .serializers import (
    TeacherListSerializer,
    TeacherDetailSerializer,
    TeacherCreateSerializer,
    TeacherUpdateSerializer,
)
from .filters import TeacherFilter


class TeacherViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    """O'qituvchilar CRUD."""

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = TeacherFilter
    search_fields = [
        'user__first_name', 'user__last_name',
        'user__email', 'specialization',
    ]
    ordering_fields = ['user__first_name', 'specialization', 'created_at']

    def get_queryset(self):
        return Teacher.objects.select_related('user').prefetch_related('subjects').all()

    def get_permissions(self):
        if self.action in ('create', 'destroy'):
            return [IsAuthenticated(), IsAdmin()]
        if self.action in ('update', 'partial_update'):
            return [IsAuthenticated(), IsManager()]
        return [IsAuthenticated(), IsTeacher()]

    def get_serializer_class(self):
        if self.action == 'create':
            return TeacherCreateSerializer
        if self.action in ('update', 'partial_update'):
            return TeacherUpdateSerializer
        if self.action == 'retrieve':
            return TeacherDetailSerializer
        return TeacherListSerializer

    def perform_destroy(self, instance):
        instance.user.is_active = False
        instance.user.save(update_fields=['is_active'])
        instance.soft_delete()

    @action(detail=True, methods=['get'])
    def groups(self, request, pk=None):
        """O'qituvchi guruhlari."""
        teacher = self.get_object()
        groups = teacher.groups.all()
        data = [
            {
                'id': group.id,
                'name': str(group),
            }
            for group in groups
        ]
        return Response(data)

    @action(detail=True, methods=['get'])
    def schedule(self, request, pk=None):
        """O'qituvchi dars jadvali."""
        teacher = self.get_object()
        schedules = teacher.schedules.all()
        data = [
            {
                'id': s.id,
                'day': s.day,
                'start_time': s.start_time,
                'end_time': s.end_time,
            }
            for s in schedules
        ]
        return Response(data)
