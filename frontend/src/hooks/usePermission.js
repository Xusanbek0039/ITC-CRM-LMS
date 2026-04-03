import useAuth from './useAuth';

const usePermission = (requiredRoles) => {
  const { hasPermission } = useAuth();
  return hasPermission(requiredRoles);
};

export default usePermission;
