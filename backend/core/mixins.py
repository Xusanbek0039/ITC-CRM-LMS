from rest_framework import status
from rest_framework.response import Response


class SoftDeleteMixin:
    """ViewSet uchun soft delete qo'llab-quvvatlash."""

    def perform_destroy(self, instance):
        instance.soft_delete()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(
            {'success': True, 'message': "Muvaffaqiyatli o'chirildi"},
            status=status.HTTP_200_OK,
        )


class SuccessResponseMixin:
    """Standart muvaffaqiyat response formati."""

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {
                'success': True,
                'message': "Muvaffaqiyatli yaratildi",
                'data': response.data,
            },
            status=status.HTTP_201_CREATED,
        )

    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        return Response(
            {
                'success': True,
                'message': "Muvaffaqiyatli yangilandi",
                'data': response.data,
            },
            status=status.HTTP_200_OK,
        )
