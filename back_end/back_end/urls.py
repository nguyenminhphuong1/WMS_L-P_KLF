
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path('nhaphang/', include('NhapHang.urls')),
    path('taodon/', include('TaoDon.urls')),
    path('xuathang/', include('XuatHang.urls')),
    path('quanlykho/', include('QuanLyKho.urls')),
    path('api/', include('wms_auth.urls')),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
