from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsManager, IsTeacher
from core.mixins import SoftDeleteMixin, SuccessResponseMixin
from .models import Course
from .serializers import (
    CourseListSerializer,
    CourseDetailSerializer,
    CourseCreateUpdateSerializer,
)
from .filters import CourseFilter


class CourseViewSet(SoftDeleteMixin, SuccessResponseMixin, viewsets.ModelViewSet):
    """Kurslar CRUD."""

    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = CourseFilter
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'created_at']
    ordering = ['-created_at']

    def get_queryset(self):
        return Course.objects.all()

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsManager()]
        return [IsAuthenticated(), IsTeacher()]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return CourseCreateUpdateSerializer
        if self.action == 'retrieve':
            return CourseDetailSerializer
        return CourseListSerializer
