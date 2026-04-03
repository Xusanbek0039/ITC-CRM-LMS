from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsTeacher, IsManager
from .models import Attendance
from .serializers import (
    AttendanceListSerializer,
    AttendanceDetailSerializer,
    AttendanceCreateSerializer,
)
from .filters import AttendanceFilter
from .services import get_attendance_stats


class AttendanceViewSet(viewsets.ModelViewSet):
    """Davomat CRUD + statistika."""

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = AttendanceFilter
    search_fields = ['group__name']
    ordering_fields = ['date']
    ordering = ['-date']

    def get_permissions(self):
        if self.action == 'destroy':
            return [IsAuthenticated(), IsManager()]
        return [IsAuthenticated(), IsTeacher()]

    def get_queryset(self):
        return Attendance.objects.select_related(
            'group', 'created_by',
        ).prefetch_related(
            'records__student__user',
        )

    def get_serializer_class(self):
        if self.action == 'create':
            return AttendanceCreateSerializer
        if self.action == 'retrieve':
            return AttendanceDetailSerializer
        return AttendanceListSerializer

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Davomat statistikasi."""
        stats = get_attendance_stats(
            group_id=request.query_params.get('group_id'),
            student_id=request.query_params.get('student_id'),
            date_from=request.query_params.get('date_from'),
            date_to=request.query_params.get('date_to'),
        )
        return Response(stats)
