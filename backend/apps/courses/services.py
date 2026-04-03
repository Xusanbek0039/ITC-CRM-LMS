from .models import Course


def get_active_courses():
    """Faol kurslar ro'yxatini qaytarish."""
    return Course.objects.filter(is_active=True)
