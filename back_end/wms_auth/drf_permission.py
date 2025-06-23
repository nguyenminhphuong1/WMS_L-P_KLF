from rest_framework.permissions import BasePermission
from .permission import has_permission

class HasCustomPermission(BasePermission):
    def has_permission(self, request, view):
        required_permission = getattr(view, 'required_permission', None)
        if not required_permission:
            return True
        return has_permission(request.user, required_permission)