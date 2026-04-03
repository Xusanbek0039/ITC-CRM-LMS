from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Count, Q

from core.permissions import IsManager
from core.mixins import SoftDeleteMixin
from .models import Room, Group, GroupStudent
from .serializers import (
    RoomSerializer,
    GroupListSerializer,
    GroupDetailSerializer,
    GroupCreateSerializer,
    GroupStudentSerializer,
    AddStudentSerializer,
    RemoveStudentSerializer,
)
from .filters import GroupFilter
from .services import add_student_to_group, remove_student_from_group


class RoomViewSet(viewsets.ModelViewSet):
    """Xonalar CRUD."""

    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated, IsManager]


class GroupViewSet(SoftDeleteMixin, viewsets.ModelViewSet):
    """Guruhlar CRUD + talabalar boshqaruvi."""

    permission_classes = [IsAuthenticated, IsManager]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = GroupFilter
    search_fields = ['name', 'course__name', 'teacher__user__first_name']
    ordering_fields = ['name', 'start_date', 'created_at']

    def get_queryset(self):
        return Group.objects.select_related(
            'course', 'teacher__user', 'room',
        ).annotate(
            students_count=Count(
                'group_students',
                filter=Q(group_students__status=GroupStudent.Status.ACTIVE),
            ),
        )

    def get_serializer_class(self):
        if self.action == 'create':
            return GroupCreateSerializer
        if self.action in ('update', 'partial_update'):
            return GroupCreateSerializer
        if self.action == 'retrieve':
            return GroupDetailSerializer
        if self.action == 'students':
            return GroupStudentSerializer
        if self.action == 'add_student':
            return AddStudentSerializer
        if self.action == 'remove_student':
            return RemoveStudentSerializer
        return GroupListSerializer

    @action(detail=True, methods=['get'])
    def students(self, request, pk=None):
        """Guruhdagi talabalar ro'yxati."""
        group = self.get_object()
        qs = group.group_students.select_related('student__user').all()
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def add_student(self, request, pk=None):
        """Guruhga talaba qo'shish."""
        group = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        gs = add_student_to_group(group, serializer.validated_data['student_id'])
        return Response(
            {
                'success': True,
                'message': "Talaba guruhga qo'shildi",
                'data': GroupStudentSerializer(gs).data,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=['post'])
    def remove_student(self, request, pk=None):
        """Guruhdan talaba chiqarish."""
        group = self.get_object()
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        gs = remove_student_from_group(group, serializer.validated_data['student_id'])
        return Response(
            {
                'success': True,
                'message': "Talaba guruhdan chiqarildi",
                'data': GroupStudentSerializer(gs).data,
            },
            status=status.HTTP_200_OK,
        )
