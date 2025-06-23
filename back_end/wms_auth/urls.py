from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import *
from .tests import UserPermissionCheckView

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'roles', RoleViewSet)
router.register(r'permissions', PermissionViewSet)
router.register(r'modules', ModuleViewSet)
router.register(r'actions', ActionViewSet)
router.register(r'user-roles', UserRoleViewSet)
router.register(r'role-permissions', RolePermissionViewSet)
router.register(r'user-direct-permissions', UserDirectPermissionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('api/users/<int:user_id>/has-permission/<str:permission_name>/', UserPermissionCheckView.as_view()),

]