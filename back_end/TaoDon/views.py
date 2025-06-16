from django.shortcuts import render
from rest_framework import viewsets, status
from django.db.models import Case, When, IntegerField, Value
from django_filters.rest_framework import DjangoFilterBackend
from datetime import date, timedelta
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import CuaHang, DonXuat, ChiTietDon
from NhapHang.models import Pallets
from QuanLyKho.models import SanPham, ViTriKho
from .serializers import (CuaHangQuanLySerializer, CuaHangSerializer,  
                        DonXuatSerializer, PalletsSerializer, ChiTietDonSerializer)

# Create your views here.
class CuaHangViewSet(viewsets.ModelViewSet):
    queryset = CuaHang.objects.all()
    serializer_class = CuaHangSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['ten_cua_hang', 'dia_chi', 'khu_vuc', 'so_dien_thoai']

    @action(detail=False, methods=['get'], url_path='danh_sach_khu_vuc')
    def list_khu_vuc(self, request):
        try:
            list_khu_vuc = self.get_queryset().values_list('khu_vuc', flat=True).distinct()
            return Response({"khu_vuc": list(list_khu_vuc)}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='danh_sach_cua_hang')
    def danh_sach_cua_hang(self, request):
        try:
            cua_hang_list = self.get_queryset().values_list('id', 'ten_cua_hang').distinct()
            data = [{"id": id, "ten_cua_hang": ten} for id, ten in cua_hang_list]
            return Response({"cua_hang": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CuaHangQuanLyViewSet(viewsets.ModelViewSet):
    queryset = CuaHang.objects.all()
    serializer_class = CuaHangQuanLySerializer
    
    
class DonXuatViewSet(viewsets.ModelViewSet):
    queryset = DonXuat.objects.all()
    serializer_class = DonXuatSerializer

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['cua_hang']
    
class PalletsViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'], url_path='loc_theo_san_pham')
    def loc_theo_san_pham(self, request):
        try:
            ten_san_pham = request.query_params.get('ten_san_pham')
            pallets_list = Pallets.objects.filter(ten_san_pham__icontains=ten_san_pham)
            serializer = PalletsSerializer(pallets_list, many=True)
            return Response({"pallets": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='sap_xep_uu_tien')
    def sap_xep_uu_tien(self, request):
        try:
            today = date.today()
            han_su_dung_moc = today + timedelta(days=30)
            kiem_tra_cl_moc = today + timedelta(days=3)
            Vi_tri_fifo = ViTriKho.objects.filter(uu_tien_fifo=True).values_list('ten_vi_tri', flat=True)
            queryset = Pallets.objects.annotate(
                priority=Case(
                    When(trang_thai="Đã_mở", then=Value(1)),
                    When(
                        han_su_dung__range=(today, han_su_dung_moc),
                        so_thung_con_lai__gt=0,
                        then=Value(2)
                    ),
                    When(
                        ngay_kiem_tra_cl__range=(today, kiem_tra_cl_moc),
                        so_thung_con_lai__gt=0,
                        then=Value(3)
                    ),
                    When(
                        vi_tri_kho__in=Vi_tri_fifo,
                        so_thung_con_lai__gt=0,
                        then=Value(4)
                    ),
                    default=Value(5),
                    output_field=IntegerField()
                )
            ).order_by('priority', 'so_thung_con_lai')

            serializer = PalletsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

"""
    @action(detail=False, methods=['get'], url_path='pallets_da_mo')
    def danh_sach_pallets_da_mo(self, request):
        try:
            queryset = Pallets.objects.filter(trang_thai='Đã_mở').order_by('so_thung_con_lai')
            serializer = PalletsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='pallets_sap_het_han')
    def pallets_sap_het_han(self, request):
        try:
            today = date.today()
            thang_sau = today + timedelta(days=30)
            queryset = Pallets.objects.filter(
                    han_su_dung__lte=thang_sau,
                    han_su_dung__gte=date.today(),
                    so_thung_con_lai__gt=0
            )
            serializer = PalletsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    @action(detail=False, methods=['get'], url_path='pallets_can_kiem_tra')
    def pallets_an_kiem_tra(self, request):
        try:
            today = date.today()
            ngay_den = today + timedelta(days=3)
            queryset = Pallets.objects.filter(
                ngay_kiem_tra_cl__range=(today, ngay_den),
                so_thung_con_lai__gt=0)
            serializer = PalletsSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
"""
    
class ChiTietDonViewSet(viewsets.ModelViewSet):
    queryset = ChiTietDon.objects.all()
    serializer_class = ChiTietDonSerializer

    @action(detail=False, methods=['get'], url_path='dropdown_san_pham')
    def dropdown_san_pham(self, request):
        try:
            san_pham_list = SanPham.objects.values_list('id', 'ten_san_pham').distinct()
            data = [{"id": id, "ten_san_pham": ten} for id, ten in san_pham_list]
            return Response({"san_pham": data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

    @action(detail=False, methods=['get'], url_path='loc_don')
    def loc_don(self, request):
        ten_cua_hang = request.query_params.get('ten_cua_hang')
        san_pham = request.query_params.get('san_pham')
        so_luong = request.query_params.get('so_luong_can')

        queryset = ChiTietDon.objects.select_related('don_xuat__cua_hang').all()

        if ten_cua_hang:
            queryset = queryset.filter(don_xuat__cua_hang__ten_cua_hang__icontains=ten_cua_hang)

        if san_pham:
            queryset = queryset.filter(san_pham__icontains=san_pham)

        if so_luong:
            queryset = queryset.filter(so_luong_can=so_luong)

        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)




    
