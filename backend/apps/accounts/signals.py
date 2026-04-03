from django.contrib.auth.signals import user_logged_in, user_logged_out
from django.dispatch import receiver
from .services import create_audit_log


@receiver(user_logged_in)
def log_user_login(sender, request, user, **kwargs):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    ip = x_forwarded_for.split(',')[0].strip() if x_forwarded_for else request.META.get('REMOTE_ADDR')
    create_audit_log(
        user=user,
        action='login',
        model_name='User',
        object_id=str(user.id),
        ip_address=ip,
    )


@receiver(user_logged_out)
def log_user_logout(sender, request, user, **kwargs):
    if user:
        create_audit_log(
            user=user,
            action='logout',
            model_name='User',
            object_id=str(user.id),
        )
