from rest_framework.permissions import BasePermission


class IsSuperAdmin(BasePermission):
    """Faqat superadmin uchun."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'superadmin'
        )


class IsAdmin(BasePermission):
    """Superadmin yoki admin uchun."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('superadmin', 'admin')
        )


class IsManager(BasePermission):
    """Superadmin, admin yoki manager uchun."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('superadmin', 'admin', 'manager')
        )


class IsTeacher(BasePermission):
    """O'qituvchi (va yuqori rollar) uchun."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role in ('superadmin', 'admin', 'manager', 'teacher')
        )


class IsStudent(BasePermission):
    """Faqat o'quvchi uchun."""

    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'student'
        )


class IsOwnerOrAdmin(BasePermission):
    """Object egasi yoki admin uchun."""

    def has_object_permission(self, request, view, obj):
        if request.user.role in ('superadmin', 'admin'):
            return True
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user


class ReadOnly(BasePermission):
    """Faqat o'qish (GET, HEAD, OPTIONS)."""

    def has_permission(self, request, view):
        return request.method in ('GET', 'HEAD', 'OPTIONS')
