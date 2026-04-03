from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """Professional xato qayta ishlash."""
    response = exception_handler(exc, context)

    if response is not None:
        custom_response = {
            'success': False,
            'errors': {},
        }

        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_response['message'] = str(response.data['detail'])
            else:
                custom_response['message'] = "Validatsiya xatosi"
                custom_response['errors'] = response.data
        elif isinstance(response.data, list):
            custom_response['message'] = response.data[0] if response.data else "Xatolik yuz berdi"
        else:
            custom_response['message'] = str(response.data)

        custom_response['status_code'] = response.status_code
        response.data = custom_response
        return response

    logger.error(
        f"Kutilmagan xatolik: {exc}",
        exc_info=True,
        extra={'context': str(context.get('view', ''))},
    )

    return Response(
        {
            'success': False,
            'message': "Ichki server xatosi",
            'status_code': 500,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )
