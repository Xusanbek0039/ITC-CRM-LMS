from .models import AuditLog


def create_audit_log(user, action, model_name='', object_id='', changes=None, ip_address=None):
    """Audit log yaratish."""
    AuditLog.objects.create(
        user=user,
        action=action,
        model_name=model_name,
        object_id=str(object_id),
        changes=changes or {},
        ip_address=ip_address,
    )


def get_client_ip(request):
    """Request dan IP manzilni olish."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        return x_forwarded_for.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR')
