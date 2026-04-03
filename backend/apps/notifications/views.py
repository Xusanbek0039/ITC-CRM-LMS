from rest_framework import mixins, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet
from rest_framework.filters import OrderingFilter

from .models import Notification
from .serializers import NotificationSerializer
from .services import mark_as_read, get_unread_count


class NotificationViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, GenericViewSet):
    """Foydalanuvchi bildirishnomalari."""

    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at', 'is_read']

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

    @action(detail=True, methods=['post'])
    def mark_read(self, request, pk=None):
        """Bitta bildirishnomani o'qilgan deb belgilash."""
        notification = mark_as_read(pk, request.user)
        serializer = self.get_serializer(notification)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def mark_all_read(self, request):
        """Barcha bildirishnomalarni o'qilgan deb belgilash."""
        updated = self.get_queryset().filter(is_read=False).update(is_read=True)
        return Response(
            {'success': True, 'updated_count': updated},
            status=status.HTTP_200_OK,
        )

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """O'qilmagan bildirishnomalar sonini qaytarish."""
        count = get_unread_count(request.user)
        return Response({'unread_count': count})
