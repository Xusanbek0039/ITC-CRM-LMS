from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from core.permissions import IsManager, IsTeacher
from .models import Schedule
from .serializers import ScheduleSerializer, ScheduleCreateSerializer
from .filters import ScheduleFilter
from .services import get_weekly_schedule, get_room_availability


class ScheduleViewSet(viewsets.ModelViewSet):
    """Dars jadvali CRUD."""

    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_class = ScheduleFilter
    ordering_fields = ['day_of_week', 'start_time']

    def get_queryset(self):
        return Schedule.objects.select_related(
            'group__course', 'group__teacher__user', 'room',
        )

    def get_permissions(self):
        if self.action in ('create', 'update', 'partial_update', 'destroy'):
            return [IsAuthenticated(), IsManager()]
        return [IsAuthenticated(), IsTeacher()]

    def get_serializer_class(self):
        if self.action in ('create', 'update', 'partial_update'):
            return ScheduleCreateSerializer
        return ScheduleSerializer

    @action(detail=False, methods=['get'])
    def by_teacher(self, request):
        """O'qituvchi bo'yicha jadval."""
        teacher_id = request.query_params.get('teacher_id')
        if not teacher_id:
            return Response({'detail': "teacher_id parametri kerak"}, status=400)
        qs = self.get_queryset().filter(group__teacher_id=teacher_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_room(self, request):
        """Xona bo'yicha jadval."""
        room_id = request.query_params.get('room_id')
        if not room_id:
            return Response({'detail': "room_id parametri kerak"}, status=400)
        qs = self.get_queryset().filter(room_id=room_id)
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def weekly(self, request):
        """Haftalik jadval — kun bo'yicha guruhlangan."""
        filters = {}
        group_id = request.query_params.get('group')
        room_id = request.query_params.get('room')
        if group_id:
            filters['group_id'] = group_id
        if room_id:
            filters['room_id'] = room_id

        weekly_data = get_weekly_schedule(filters or None)
        result = {}
        for day, schedules in weekly_data.items():
            result[day] = ScheduleSerializer(schedules, many=True).data
        return Response(result)
