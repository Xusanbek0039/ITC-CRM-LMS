from decimal import Decimal

from django.db.models import Sum
from django.utils import timezone

from apps.groups.models import GroupStudent
from .models import Payment


def create_payment(validated_data, user):
    """To'lov yaratish."""
    return Payment.objects.create(created_by=user, **validated_data)


def get_debtors():
    """Qarzdor talabalarni qaytaradi.

    Har bir faol GroupStudent uchun:
    debt = (o'tgan oylar soni * kurs narxi) - jami to'langan summa
    """
    today = timezone.now().date()
    active_group_students = GroupStudent.objects.filter(
        status=GroupStudent.Status.ACTIVE,
    ).select_related('student__user', 'group__course')

    debtors = []
    for gs in active_group_students:
        course_price = gs.group.course.price
        start_date = gs.joined_date or gs.group.start_date

        months_passed = (
            (today.year - start_date.year) * 12
            + (today.month - start_date.month)
            + 1
        )
        if months_passed < 1:
            months_passed = 1

        total_expected = course_price * months_passed

        total_paid = Payment.objects.filter(
            student=gs.student,
            group=gs.group,
        ).aggregate(total=Sum('amount'))['total'] or Decimal('0')

        total_discount = Payment.objects.filter(
            student=gs.student,
            group=gs.group,
        ).aggregate(total=Sum('discount'))['total'] or Decimal('0')

        debt = total_expected - (total_paid - total_discount)

        if debt > 0:
            debtors.append({
                'student_id': gs.student.id,
                'student_name': gs.student.user.full_name,
                'group_id': gs.group.id,
                'group_name': gs.group.name,
                'course_price': course_price,
                'months_passed': months_passed,
                'total_expected': total_expected,
                'total_paid': total_paid - total_discount,
                'debt': debt,
            })

    return debtors


def get_monthly_report(year, month):
    """Oylik to'lov hisoboti."""
    payments = Payment.objects.filter(
        payment_date__year=year,
        payment_date__month=month,
    )

    total_income = payments.aggregate(
        total=Sum('amount'),
    )['total'] or Decimal('0')

    total_discount = payments.aggregate(
        total=Sum('discount'),
    )['total'] or Decimal('0')

    payment_count = payments.count()

    breakdown = {}
    for choice_value, choice_label in Payment.PaymentType.choices:
        type_payments = payments.filter(payment_type=choice_value)
        type_total = type_payments.aggregate(
            total=Sum('amount'),
        )['total'] or Decimal('0')
        breakdown[choice_value] = {
            'label': choice_label,
            'count': type_payments.count(),
            'total': type_total,
        }

    return {
        'year': year,
        'month': month,
        'total_income': total_income,
        'total_discount': total_discount,
        'net_income': total_income - total_discount,
        'payment_count': payment_count,
        'breakdown': breakdown,
    }
