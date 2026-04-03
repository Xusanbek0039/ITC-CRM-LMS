import useAuthStore from '../store/useAuthStore';

const useAuth = () => {
  const { user, isAuthenticated, hasRole, hasPermission } = useAuthStore();

  const isAdmin = hasRole(['superadmin', 'admin']);
  const isManager = hasRole(['superadmin', 'admin', 'manager']);
  const isTeacher = hasRole(['superadmin', 'admin', 'manager', 'teacher']);
  const isStudent = hasRole('student');

  return {
    user,
    isAuthenticated,
    isAdmin,
    isManager,
    isTeacher,
    isStudent,
    hasRole,
    hasPermission,
  };
};

export default useAuth;
