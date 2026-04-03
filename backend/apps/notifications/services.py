from .models import Notification


def send_notification(recipient, title, message, notification_type='system'):
    """Bitta foydalanuvchiga bildirishnoma yuborish."""
    return Notification.objects.create(
        recipient=recipient,
        title=title,
        message=message,
        notification_type=notification_type,
    )


def send_bulk_notification(recipients_queryset, title, message, notification_type='system'):
    """Bir nechta foydalanuvchilarga bildirishnoma yuborish."""
    notifications = [
        Notification(
            recipient=recipient,
            title=title,
            message=message,
            notification_type=notification_type,
        )
        for recipient in recipients_queryset
    ]
    return Notification.objects.bulk_create(notifications)


def send_payment_reminder(student):
    """O'quvchiga to'lov eslatmasi yuborish."""
    return send_notification(
        recipient=student.user,
        title="To'lov eslatmasi",
        message=f"{student.user.full_name}, sizda to'lanmagan to'lov mavjud. Iltimos, to'lovni amalga oshiring.",
        notification_type='payment_reminder',
    )


def send_attendance_warning(student, group):
    """O'quvchiga davomat ogohlantirishи yuborish."""
    return send_notification(
        recipient=student.user,
        title="Davomat ogohlantirishи",
        message=f"{student.user.full_name}, sizning {group} guruhidagi davomatingiz past. Iltimos, darslarga qatnashing.",
        notification_type='attendance_warning',
    )


def mark_as_read(notification_id, user):
    """Bildirishnomani o'qilgan deb belgilash."""
    notification = Notification.objects.get(id=notification_id, recipient=user)
    notification.is_read = True
    notification.save(update_fields=['is_read'])
    return notification


def get_unread_count(user):
    """O'qilmagan bildirishnomalar sonini qaytarish."""
    return Notification.objects.filter(recipient=user, is_read=False).count()
