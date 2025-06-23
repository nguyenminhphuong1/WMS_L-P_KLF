from django.db import connection
from django.core.cache import cache
from .models import UserDirectPermission, UserRole, RolePermission, Role

CACHE_TIMEOUT = 60 * 5 # 5 minutes
CACHE_PREFIX = "perm_cache"



def has_permission(user, permission_name):
    print("🔍 has_permission start")
    """
    Checks if a user has a specific permission, with caching.
    """
    # Generate a unique cache key for the user and permission
    cache_key = f"{CACHE_PREFIX}:{user.id}:{permission_name}"
    
    # First, try to get the result from the cache
    cached_result = cache.get(cache_key)

    if cached_result is not None:
        return cached_result

    # If not in cache, perform the full check
    result = _check_permission_in_db(user, permission_name)


    # Store the result in the cache for future requests
    cache.set(cache_key, result, CACHE_TIMEOUT)


    return result

import time

def _check_permission_in_db(user, permission_name):
    print("DEBUG: _check_permission_in_db called")
    # 1. Direct permission check (takes precedence)
    direct_perm = UserDirectPermission.objects.filter(user=user, permission__name=permission_name).first()
    print("DEBUG: direct_perm checked")
    if direct_perm is not None:
        print("DEBUG: direct_perm found")
        return direct_perm.is_granted

    # 2. Role-based permission check using a recursive query to get all roles
    user_role_table = UserRole._meta.db_table
    role_parents_table = Role.parents.through._meta.db_table

    print("DEBUG: about to run CTE query")
    query = f"""
        WITH RECURSIVE all_user_roles(role_id) AS (
            SELECT role_id FROM {user_role_table} WHERE user_id = %s
            UNION
            SELECT T2.to_role_id
            FROM all_user_roles AS T1
            INNER JOIN {role_parents_table} AS T2 ON T1.role_id = T2.from_role_id
        )
        SELECT role_id FROM all_user_roles;
    """

    with connection.cursor() as cursor:
        cursor.execute(query, [user.id])
        all_role_ids = {row[0] for row in cursor.fetchall()}
    print("DEBUG: CTE query finished, all_role_ids:", all_role_ids)

    if not all_role_ids:
        print("DEBUG: no roles found")
        return False

    # 3. Check if any of the user's roles have the required permission
    result = RolePermission.objects.filter(
        role_id__in=all_role_ids,
        permission__name=permission_name
    ).exists()
    print("DEBUG: permission check result:", result)
    return result


def clear_cache_for_user(user_id):
    pattern = f"perm_cache:{user_id}:*"
    try:
        cache.delete_pattern(pattern)
    except AttributeError:
        # Fallback cho LocMemCache hoặc backend không hỗ trợ
        cache_key = f"perm_cache:{user_id}:mod1.view"
        cache.delete(cache_key)