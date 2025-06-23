from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import User, UserDirectPermission
from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import Role, Permission, Module, Action, UserRole, RolePermission
from .permission import has_permission
from django.core.cache import cache
from django.db.models.signals import post_save, post_delete, m2m_changed
from wms_auth.signals import (
    handle_user_role_change,
    handle_user_direct_permission_change,
    handle_role_permission_change,
    handle_role_hierarchy_change,
)




class UserPermissionCheckView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, user_id, permission_name):
        user = User.objects.get(id=user_id)
        granted = has_permission(user, permission_name)
        return Response({'granted': granted})

class PermissionCacheTest(TestCase):
    def setUp(self):
        post_save.disconnect(handle_user_role_change, sender=UserRole)
        post_delete.disconnect(handle_user_role_change, sender=UserRole)

        post_save.disconnect(handle_user_direct_permission_change, sender=UserDirectPermission)
        post_delete.disconnect(handle_user_direct_permission_change, sender=UserDirectPermission)

        post_save.disconnect(handle_role_permission_change, sender=RolePermission)
        post_delete.disconnect(handle_role_permission_change, sender=RolePermission)

        m2m_changed.disconnect(handle_role_hierarchy_change, sender=Role.parents.through)

        print("SETUP START")
        self.user = get_user_model().objects.create(username='testuser')
        print("User created")
        print("User ID:", self.user.id)

        module = Module.objects.create(name='mod1')
        print("Module created")

        action = Action.objects.create(name='view')
        print("Action created")

        self.permission = Permission.objects.create(name='mod1.view', module=module, action=action)
        print("Permission created")

        self.role = Role.objects.create(name='role1')
        self.role.parents.clear()
        print("Role created")

        UserRole.objects.create(user=self.user, role=self.role)
        print("UserRole created")

        RolePermission.objects.create(role=self.role, permission=self.permission)
        print("RolePermission created")


        cache.clear()
        print("Cache cleared")

        print("CALLING has_permission() for test")
        has_permission(self.user, 'mod1.view')
        print("FINISHED has_permission()")

    def test_permission_cache(self):
        # Lần đầu: cache miss, lấy từ DB
        self.assertTrue(has_permission(self.user, 'mod1.view'))
        # Xóa quyền khỏi role, nhưng cache vẫn còn nên vẫn trả về True
        RolePermission.objects.filter(role=self.role, permission=self.permission).delete()
        self.assertTrue(has_permission(self.user, 'mod1.view'))
        # Xóa cache, kiểm tra lại sẽ trả về False
        cache.clear()
        self.assertFalse(has_permission(self.user, 'mod1.view'))

    def test_cache_invalidation_on_role_permission_change(self):
        print("STEP 1: check has_permission is True")
        self.assertTrue(has_permission(self.user, 'mod1.view'))

        print("STEP 2: delete RolePermission")
        RolePermission.objects.filter(role=self.role, permission=self.permission).delete()

        print("STEP 3: check has_permission again (should be False)")
        from wms_auth.permission import clear_cache_for_user
        clear_cache_for_user(self.user.id)
        self.assertFalse(has_permission(self.user, 'mod1.view'))

        print("TEST DONE")
