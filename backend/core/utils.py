import re
from django.utils import timezone


def validate_phone_number(phone):
    """O'zbekiston telefon raqam formati: +998XXXXXXXXX"""
    pattern = r'^\+998[0-9]{9}$'
    return bool(re.match(pattern, phone))


def get_current_month_range():
    """Joriy oyning boshi va oxirini qaytaradi."""
    now = timezone.now()
    start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    if now.month == 12:
        end = now.replace(year=now.year + 1, month=1, day=1) - timezone.timedelta(seconds=1)
    else:
        end = now.replace(month=now.month + 1, day=1) - timezone.timedelta(seconds=1)
    return start, end


def generate_unique_code(prefix, model_class, field='code'):
    """Unique kod generatsiya qilish (masalan: STD-0001)."""
    last = model_class.all_objects.order_by('-created_at').first()
    if last and hasattr(last, field):
        last_num = int(getattr(last, field).split('-')[-1])
        new_num = last_num + 1
    else:
        new_num = 1
    return f"{prefix}-{new_num:04d}"
