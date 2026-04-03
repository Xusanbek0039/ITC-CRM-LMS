from django.db.models import Count, Sum, Q, F
from django.utils import timezone
from datetime import timedelta
from apps.students.models import Student
from apps.groups.models import Group, GroupStudent
from apps.payments.models import Payment
from apps.attendance.models import Attendance, AttendanceRecord
from apps.leads.models import Lead
from apps.courses.models import Course


def get_dashboard_stats():
    """Dashboard KPI larini qaytaradi."""
    now = timezone.now()
    month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    week_ago = now - timedelta(days=7)

    total_students = Student.objects.filter(status='active').count()
    active_groups = Group.objects.filter(status='active').count()

    # Oylik tushum
    monthly_income = Payment.objects.filter(
        payment_date__gte=month_start.date(),
        payment_date__lte=now.date(),
    ).aggregate(total=Sum('amount'))['total'] or 0

    # Qarzdorlar soni (active students who haven't paid for current month)
    active_group_students = GroupStudent.objects.filter(
        status='active',
        group__status='active',
    ).values_list('student_id', flat=True).distinct()

    paid_this_month = Payment.objects.filter(
        period_month__year=now.year,
        period_month__month=now.month,
    ).values_list('student_id', flat=True).distinct()

    debtors_count = len(set(active_group_students) - set(paid_this_month))

    # Yangi leadlar
    new_leads = Lead.objects.filter(created_at__gte=week_ago).count()

    return {
        'total_active_students': total_students,
        'active_groups': active_groups,
        'monthly_income': float(monthly_income),
        'debtors_count': debtors_count,
        'new_leads_this_week': new_leads,
    }


def get_student_stats():
    """O'quvchi statistikasi."""
    return {
        'total': Student.objects.count(),
        'active': Student.objects.filter(status='active').count(),
        'frozen': Student.objects.filter(status='frozen').count(),
        'graduated': Student.objects.filter(status='graduated').count(),
        'left': Student.objects.filter(status='left').count(),
    }


def get_financial_report(year=None, month=None):
    """Moliyaviy hisobot."""
    now = timezone.now()
    year = year or now.year
    month = month or now.month

    payments = Payment.objects.filter(
        payment_date__year=year,
        payment_date__month=month,
    )

    total_income = payments.aggregate(total=Sum('amount'))['total'] or 0
    total_discount = payments.aggregate(total=Sum('discount'))['total'] or 0
    payment_count = payments.count()

    by_type = payments.values('payment_type').annotate(
        total=Sum('amount'),
        count=Count('id'),
    )

    return {
        'year': year,
        'month': month,
        'total_income': float(total_income),
        'total_discount': float(total_discount),
        'net_income': float(total_income - total_discount),
        'payment_count': payment_count,
        'by_payment_type': list(by_type),
    }


def get_attendance_report(group_id=None, date_from=None, date_to=None):
    """Davomat hisoboti."""
    records = AttendanceRecord.objects.all()
    if group_id:
        records = records.filter(attendance__group_id=group_id)
    if date_from:
        records = records.filter(attendance__date__gte=date_from)
    if date_to:
        records = records.filter(attendance__date__lte=date_to)

    total = records.count()
    if total == 0:
        return {'total_records': 0, 'attendance_rate': 0}

    present = records.filter(status='present').count()
    absent = records.filter(status='absent').count()
    late = records.filter(status='late').count()
    excused = records.filter(status='excused').count()

    return {
        'total_records': total,
        'present': present,
        'absent': absent,
        'late': late,
        'excused': excused,
        'attendance_rate': round((present + late) / total * 100, 1),
    }


def get_lead_report():
    """Lead analitika."""
    total = Lead.objects.count()
    by_status = Lead.objects.values('status').annotate(count=Count('id'))
    by_source = Lead.objects.values('source').annotate(count=Count('id'))

    enrolled = Lead.objects.filter(status='enrolled').count()
    conversion_rate = round(enrolled / total * 100, 1) if total > 0 else 0

    return {
        'total_leads': total,
        'conversion_rate': conversion_rate,
        'by_status': list(by_status),
        'by_source': list(by_source),
    }


def get_top_courses():
    """Eng ko'p o'quvchili kurslar."""
    return list(
        Course.objects.annotate(
            students_count=Count('groups__group_students', filter=Q(groups__group_students__status='active'))
        ).order_by('-students_count')[:10].values('id', 'name', 'students_count')
    )
