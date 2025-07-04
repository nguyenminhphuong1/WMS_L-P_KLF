from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (CuaHangViewSet, ChiTietViTriCuaHangViewSet, 
                    PalletsViewSet, DonXuatViewSet, ChiTietDonViewSet)

router = DefaultRouter()
router.register(r'cuahang', CuaHangViewSet, basename='cuahang')
router.register(r'donxuat', DonXuatViewSet, basename='donxuat')
router.register(r'chitietvitricuahang', ChiTietViTriCuaHangViewSet)
router.register(r'chitietdon', ChiTietDonViewSet, basename='chitietdon')
router.register(r'pallets', PalletsViewSet, basename='pallets')

urlpatterns = [
    path('', include(router.urls)),
]