from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Pallets
from .serializers import PalletsSerializers
from QuanLyKho.models import SanPham

# Create your views here.
class PalletsViewSet(viewsets.ModelViewSet):
    queryset = Pallets.objects.all()
    serializer_class = PalletsSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ten_san_pham', 'so_thung_con_lai', 'vi_tri_kho', 'trang_thai']

    @action(detail=True, methods=['get'], url_path='quan_ly')
    def quan_ly(self, request, pk=None):
        try:
            pallet = Pallets.objects.get(id=pk)
            data = {
                "ma_pallet": pallet.ma_pallet,
                "ten_san_pham": pallet.ten_san_pham,
                "so_thung_ban_dau": pallet.so_thung_ban_dau,
                "so_thung_con_lai": pallet.so_thung_con_lai,
                "vi_tri_kho": pallet.vi_tri_kho,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Pallets.DoesNotExist:
            return Response(
                {"message": "Không thấy thông tin Pallets."},
                status=status.HTTP_404_NOT_FOUND
            )
        
    @action(detail=True, methods=['get'], url_path='theo_doi')
    def theo_doi(self, request, pk=None):
        try:
            pallet = Pallets.objects.get(id=pk)
            data = {
                "ngay_san_xuat": pallet.ngay_san_xuat,
                "han_su_dung": pallet.han_su_dung,
                "ngay_kiem_tra_cl": pallet.ngay_kiem_tra_cl,
            }
            return Response(data, status=status.HTTP_200_OK)
        except Pallets.DoesNotExist:
            return Response(
                {"message": "Không thấy thông tin Pallets."},
                status=status.HTTP_404_NOT_FOUND
            )
        
class SanPhamViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'], url_path='danh_sach_san_pham')
    def danh_sach_san_pham(self, request):
        try:
            san_pham_list = SanPham.objects.values_list('id', 'ten_san_pham').distinct()
            data = [{"id": id, "ten_san_pham": ten} for id, ten in san_pham_list]
            return Response({"ds_san_pham": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
