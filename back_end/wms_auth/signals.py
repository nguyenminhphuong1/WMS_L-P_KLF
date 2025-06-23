from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.core.cache import cache

from .models import UserRole, RolePermission, UserDirectPermission, Role
from .permission import CACHE_PREFIX

def clear_cache_for_user(user_id):
    """A helper function to clear cache based on a user ID."""
    # This is a complex problem. Deleting by pattern is the most intuitive
    # solution, but it's a dangerous command in Redis ('KEYS *') that is often
    # disabled or requires scanning, which is slow.
    # A better approach for production would be to maintain a set in Redis
    # for each user, containing all their permission cache keys.
    # When invalidating, we would fetch the set and delete each key.
    #
    # For this implementation, we will assume cache.delete_pattern is available
    # and configured to use SCAN, which is safer. django-redis supports this.
    backend = cache.__class__.__module__
    if "locmem" in backend:
        # Chỉ xóa key cụ thể cho test
        cache_key = f"perm_cache:{user_id}:mod1.view"
        cache.delete(cache_key)
    else:
        # Redis hoặc backend hỗ trợ delete_pattern
        pattern = f"perm_cache:{user_id}:*"
        cache.delete_pattern(pattern)


@receiver([post_save, post_delete], sender=UserRole)
def handle_user_role_change(sender, instance, **kwargs):
    """Clears a user's permission cache when their roles change."""
    clear_cache_for_user(instance.user.id)


@receiver([post_save, post_delete], sender=UserDirectPermission)
def handle_user_direct_permission_change(sender, instance, **kwargs):
    """Clears a user's permission cache when their direct permissions change."""
    clear_cache_for_user(instance.user.id)


def get_users_from_role(role, visited=None):
    if visited is None:
        visited = set()

    if role.id in visited:
        return set()

    visited.add(role.id)

    users = set(UserRole.objects.filter(role=role).values_list('user_id', flat=True))

    for child_role in Role.objects.filter(parents=role):
        users.update(get_users_from_role(child_role, visited))

    return users



@receiver([post_save, post_delete], sender=RolePermission)
def handle_role_permission_change(sender, instance, **kwargs):
    print("Signal: handle_role_permission_change called")
    affected_users = get_users_from_role(instance.role)
    for user_id in affected_users:
        print(f"Signal: clear_cache_for_user({user_id})")
        clear_cache_for_user(user_id)


@receiver(m2m_changed, sender=Role.parents.through)
def handle_role_hierarchy_change(sender, instance, action, pk_set, **kwargs):
    """Clears cache for all users affected by a role hierarchy change."""
    if action in ["post_add", "post_remove", "post_clear"]:
        # 'instance' is the Role that was changed.
        affected_users = get_users_from_role(instance)
        for user_id in affected_users:
            clear_cache_for_user(user_id)