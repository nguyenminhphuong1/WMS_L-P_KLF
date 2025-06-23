from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    pass

class Module(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)

class Action(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)

class Permission(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    action = models.ForeignKey(Action, on_delete=models.CASCADE)

class Role(models.Model):
    name = models.CharField(max_length=50, unique=True)
    description = models.TextField(blank=True)
    is_system_role = models.BooleanField(default=False)
    parents = models.ManyToManyField('self', symmetrical=False, blank=True)

class UserRole(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)

class RolePermission(models.Model):
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)

class UserDirectPermission(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    permission = models.ForeignKey(Permission, on_delete=models.CASCADE)
    is_granted = models.BooleanField(default=True)