from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PalletsViewSet, SanPhamViewSet

router = DefaultRouter()
router.register(r'pallets', PalletsViewSet)
router.register(r'sanpham', SanPhamViewSet, basename='sanpham')


urlpatterns = [
    path('', include(router.urls)),
]