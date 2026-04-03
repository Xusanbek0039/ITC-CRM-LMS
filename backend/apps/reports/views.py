from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from core.permissions import IsManager
from .services import (
    get_dashboard_stats,
    get_student_stats,
    get_financial_report,
    get_attendance_report,
    get_lead_report,
)


class DashboardView(APIView):
    """Dashboard KPI lari."""

    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        data = get_dashboard_stats()
        return Response({'success': True, 'data': data})


class StudentStatsView(APIView):
    """O'quvchi statistikasi."""

    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        data = get_student_stats()
        return Response({'success': True, 'data': data})


class FinancialReportView(APIView):
    """Moliyaviy hisobot."""

    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        year = request.query_params.get('year')
        month = request.query_params.get('month')
        data = get_financial_report(
            year=int(year) if year else None,
            month=int(month) if month else None,
        )
        return Response({'success': True, 'data': data})


class AttendanceReportView(APIView):
    """Davomat hisoboti."""

    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        data = get_attendance_report(
            group_id=request.query_params.get('group_id'),
            date_from=request.query_params.get('date_from'),
            date_to=request.query_params.get('date_to'),
        )
        return Response({'success': True, 'data': data})


class LeadReportView(APIView):
    """Lead analitika."""

    permission_classes = [IsAuthenticated, IsManager]

    def get(self, request):
        data = get_lead_report()
        return Response({'success': True, 'data': data})
