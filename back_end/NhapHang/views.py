from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Pallets
from .serializers import PalletsSerializers
from QuanLyKho.models import SanPham, ViTriKho

# Create your views here.
class PalletsViewSet(viewsets.ModelViewSet):
    queryset = Pallets.objects.all()
    serializer_class = PalletsSerializers
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ten_san_pham', 'so_thung_con_lai', 'vi_tri_kho', 'trang_thai']

    @action(detail=True, methods=['get'], url_path='quan_ly')
    def quan_ly(self, request, pk=None):
        pallet = get_object_or_404(Pallets, pk=pk)
    
        data = {
            "ma_pallet": pallet.ma_pallet,
            "ten_san_pham": pallet.ten_san_pham,
            "so_thung_ban_dau": pallet.so_thung_ban_dau,
            "so_thung_con_lai": pallet.so_thung_con_lai,
            "vi_tri_kho": pallet.vi_tri_kho,
        }
        return Response(data, status=status.HTTP_200_OK)
        
    @action(detail=True, methods=['get'], url_path='theo_doi')
    def theo_doi(self, request, pk=None):
        pallet = get_object_or_404(Pallets, pk=pk)
        data = {
            "ngay_san_xuat": pallet.ngay_san_xuat,
            "han_su_dung": pallet.han_su_dung,
            "ngay_kiem_tra_cl": pallet.ngay_kiem_tra_cl,
        }
        return Response(data, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['get'], url_path='drop_down')
    def drop_down(self, request):
        try:
            san_pham_list = SanPham.objects.values_list('id', 'ten_san_pham').distinct()
            vi_tri_kho_list = ViTriKho.objects.values_list('id', 'ten_vi_tri').distinct()
            ds_san_pham = [{"id": sp["id"], "label": sp["ten_san_pham"]} for sp in san_pham_list]
            ds_vi_tri_kho = [{"id": vt["id"], "label": vt["ten_vi_tri"]} for vt in vi_tri_kho_list]

            return Response({
                "ds_san_pham": ds_san_pham,
                "ds_vi_tri_kho": ds_vi_tri_kho
            }, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    
