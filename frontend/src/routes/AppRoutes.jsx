import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from '../pages/auth/LoginPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import StudentsListPage from '../pages/students/StudentsListPage';
import StudentCreatePage from '../pages/students/StudentCreatePage';
import StudentEditPage from '../pages/students/StudentEditPage';
import StudentDetailPage from '../pages/students/StudentDetailPage';
import TeachersListPage from '../pages/teachers/TeachersListPage';
import TeacherCreatePage from '../pages/teachers/TeacherCreatePage';
import TeacherEditPage from '../pages/teachers/TeacherEditPage';
import CoursesListPage from '../pages/courses/CoursesListPage';
import CourseCreatePage from '../pages/courses/CourseCreatePage';
import CourseEditPage from '../pages/courses/CourseEditPage';
import GroupsListPage from '../pages/groups/GroupsListPage';
import GroupCreatePage from '../pages/groups/GroupCreatePage';
import GroupEditPage from '../pages/groups/GroupEditPage';
import GroupDetailPage from '../pages/groups/GroupDetailPage';
import AttendancePage from '../pages/attendance/AttendancePage';
import PaymentsListPage from '../pages/payments/PaymentsListPage';
import PaymentCreatePage from '../pages/payments/PaymentCreatePage';
import SchedulePage from '../pages/schedule/SchedulePage';
import LeadsListPage from '../pages/leads/LeadsListPage';
import LeadCreatePage from '../pages/leads/LeadCreatePage';
import LeadEditPage from '../pages/leads/LeadEditPage';
import ReportsPage from '../pages/reports/ReportsPage';
import SettingsPage from '../pages/settings/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';

const adminRoles = ['superadmin', 'admin'];
const managerRoles = ['superadmin', 'admin', 'manager'];
const teacherRoles = ['superadmin', 'admin', 'manager', 'teacher'];
const allRoles = ['superadmin', 'admin', 'manager', 'teacher', 'student'];

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        element={
          <ProtectedRoute roles={allRoles}>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard */}
        <Route path="/" element={<DashboardPage />} />

        {/* Students */}
        <Route path="/students" element={<ProtectedRoute roles={managerRoles}><StudentsListPage /></ProtectedRoute>} />
        <Route path="/students/create" element={<ProtectedRoute roles={managerRoles}><StudentCreatePage /></ProtectedRoute>} />
        <Route path="/students/:id/edit" element={<ProtectedRoute roles={managerRoles}><StudentEditPage /></ProtectedRoute>} />
        <Route path="/students/:id" element={<ProtectedRoute roles={managerRoles}><StudentDetailPage /></ProtectedRoute>} />

        {/* Teachers */}
        <Route path="/teachers" element={<ProtectedRoute roles={adminRoles}><TeachersListPage /></ProtectedRoute>} />
        <Route path="/teachers/create" element={<ProtectedRoute roles={adminRoles}><TeacherCreatePage /></ProtectedRoute>} />
        <Route path="/teachers/:id/edit" element={<ProtectedRoute roles={adminRoles}><TeacherEditPage /></ProtectedRoute>} />

        {/* Courses */}
        <Route path="/courses" element={<ProtectedRoute roles={managerRoles}><CoursesListPage /></ProtectedRoute>} />
        <Route path="/courses/create" element={<ProtectedRoute roles={managerRoles}><CourseCreatePage /></ProtectedRoute>} />
        <Route path="/courses/:id/edit" element={<ProtectedRoute roles={managerRoles}><CourseEditPage /></ProtectedRoute>} />

        {/* Groups */}
        <Route path="/groups" element={<ProtectedRoute roles={teacherRoles}><GroupsListPage /></ProtectedRoute>} />
        <Route path="/groups/create" element={<ProtectedRoute roles={managerRoles}><GroupCreatePage /></ProtectedRoute>} />
        <Route path="/groups/:id/edit" element={<ProtectedRoute roles={managerRoles}><GroupEditPage /></ProtectedRoute>} />
        <Route path="/groups/:id" element={<ProtectedRoute roles={teacherRoles}><GroupDetailPage /></ProtectedRoute>} />

        {/* Attendance */}
        <Route path="/attendance" element={<ProtectedRoute roles={teacherRoles}><AttendancePage /></ProtectedRoute>} />

        {/* Payments */}
        <Route path="/payments" element={<ProtectedRoute roles={managerRoles}><PaymentsListPage /></ProtectedRoute>} />
        <Route path="/payments/create" element={<ProtectedRoute roles={managerRoles}><PaymentCreatePage /></ProtectedRoute>} />

        {/* Schedule */}
        <Route path="/schedule" element={<ProtectedRoute roles={teacherRoles}><SchedulePage /></ProtectedRoute>} />

        {/* Leads */}
        <Route path="/leads" element={<ProtectedRoute roles={managerRoles}><LeadsListPage /></ProtectedRoute>} />
        <Route path="/leads/create" element={<ProtectedRoute roles={managerRoles}><LeadCreatePage /></ProtectedRoute>} />
        <Route path="/leads/:id/edit" element={<ProtectedRoute roles={managerRoles}><LeadEditPage /></ProtectedRoute>} />

        {/* Reports */}
        <Route path="/reports" element={<ProtectedRoute roles={managerRoles}><ReportsPage /></ProtectedRoute>} />

        {/* Settings */}
        <Route path="/settings" element={<SettingsPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
