from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.DashboardView.as_view(), name='report-dashboard'),
    path('students/', views.StudentStatsView.as_view(), name='report-students'),
    path('financial/', views.FinancialReportView.as_view(), name='report-financial'),
    path('attendance/', views.AttendanceReportView.as_view(), name='report-attendance'),
    path('leads/', views.LeadReportView.as_view(), name='report-leads'),
]
