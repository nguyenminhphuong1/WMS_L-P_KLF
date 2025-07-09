from django.db import models

# Create your models here.
class ChiTietViTriCuaHang(models.Model):
    thanh_pho = models.CharField(max_length=50, null=False)
    huyen = models.CharField(max_length=50, null=False)
    xa = models.CharField(max_length=50, null=False)
    dia_chi_chi_tiet = models.TextField(null=False)

    class Meta:
        db_table = 'chi_tiet_vi_tri_cua_hang'
        verbose_name = 'Chi tiết vị trí cửa hàng'
        verbose_name_plural = 'Chi tiết vị trí cửa hàng'
    
    def __str__(self):
        return self.dia_chi_chi_tiet

class CuaHang(models.Model):
    ma_cua_hang = models.CharField(unique=True, max_length=20, null=False)
    ten_cua_hang = models.CharField(max_length=100, null=False)
    so_dien_thoai = models.CharField(max_length=15, blank=True, null=True)
    dia_chi = models.ForeignKey('ChiTietViTriCuaHang', models.PROTECT)
    trang_thai = models.CharField(max_length=9, choices=[
        ('Hoạt_động', 'Hoạt động'),
        ('Tạm_dừng', 'Tạm dừng')
    ], default='Hoạt_động')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'cua_hang'
        verbose_name = 'Cửa hàng'
        verbose_name_plural = 'Cửa hàng'
    
    def __str__(self):
        return self.ten_cua_hang

class DonXuat(models.Model):
    ma_don = models.CharField(unique=True, max_length=20)
    cua_hang = models.ForeignKey('CuaHang', models.PROTECT)
    ngay_tao = models.DateField()
    ngay_giao = models.DateField(blank=True, null=True)
    trang_thai = models.CharField(max_length=10, choices=[
        ('Chờ_xuất', 'Chờ xuất'),
        ('Đang_xuất', 'Đang xuất'),
        ('Hoàn_thành', 'Hoàn thành'),
        ('Hủy', 'Hủy')
    ], default='Chờ_xuất')
    qr_code_data = models.TextField(blank=True, null=True)
    da_in_qr = models.BooleanField(blank=True, null=True, default=False)
    nguoi_tao = models.CharField(max_length=50, blank=True, null=True)
    ghi_chu = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'don_xuat'

    def __str__(self):
        return self.ma_don

class ChiTietDon(models.Model):
    don_xuat = models.ForeignKey('DonXuat', models.PROTECT)
    san_pham = models.ForeignKey('QuanLyKho.SanPham', models.PROTECT)
    so_luong_can = models.IntegerField()
    pallet_assignments = models.JSONField(blank=True, null=True)
    da_xuat_xong = models.BooleanField(null=True, default=False)
    ghi_chu = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'chi_tiet_don'

    def update_order_quantity(self, so_luong_moi, so_luong_cu):
        if so_luong_moi < so_luong_cu:
            #Lấy ra id các pallet vừa được lấy ra (Lấy cái sau cùng để phù hợp trả lại)
            reversed_ids = [p["id"] for p in self.pallet_assignments[::-1]]

            from NhapHang.models import Pallets
            pallets = Pallets.objects.filter(
                id__in=reversed_ids,
            )

            #Loại bỏ đi pallet trong danh sách pallet
            result = self.import_goods(pallets, so_luong_cu - so_luong_moi, self.don_xuat)
            pallet_map = {p['id']: p for p in self.pallet_assignments}
            result_map = {p['id']: p for p in result}
            
            for pallet_id in pallet_map:
                if pallet_id in result_map:
                    pallet_map[pallet_id]['so_thung'] -= result_map[pallet_id]['so_thung']
                    
            self.pallet_assignments = [
                p for p in pallet_map.values() if p['so_thung'] > 0
            ]

        else:
            new_quantity = so_luong_moi-so_luong_cu
            self.get_suitable_pallet(new_quantity)

    #Hàm thêm số lượng vào pallet nếu số lượng bị thay đổi ít đi
    def import_goods(self, pallets, quantity, don_xuat, result=None):
        if result == None:
            result = []

        pallet = pallets[0]
        if quantity + pallet.so_thung_con_lai <= pallet.so_thung_ban_dau:
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": quantity
            })
            pallet.import_quantity(quantity, don_xuat, don_xuat.nguoi_tao)
            return result
        else:
            much = pallet.so_thung_ban_dau - pallet.so_thung_con_lai
            remaining = quantity - much
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": much
            })
            pallet.import_quantity(much, don_xuat, don_xuat.nguoi_tao)
            return self.import_goods(pallets[1:], remaining, don_xuat, result)

    #Hàm lấy ra pallet phù hợp để lấy
    def get_suitable_pallet(self, so_luong):
        from NhapHang.models import Pallets
        pallets = Pallets.objects.filter(
            san_pham=self.san_pham, 
        ).exclude(
            trang_thai__in=['Hỏng', 'Trống']
        ).select_related('vi_tri_kho')

        priority_pallets = sorted(
            [p for p in pallets if p.vi_tri_kho],
            key=lambda p: p.vi_tri_kho.get_pickup_priority(),
            reverse=False
        )
        result = self.get_goods(priority_pallets, so_luong, self.don_xuat)

        #Gán pallet cho pallet asignment
        #Cập nhật số thùng pallets nếu lấy thêm
        pallet_map = {p['id']: p for p in self.pallet_assignments}
        result_map = {p['id']: p for p in result}
        
        for pallet_id in pallet_map:
            if pallet_id in result_map:
                result_map[pallet_id]['so_thung'] += pallet_map[pallet_id]['so_thung']
    
        self.pallet_assignments = [
            p for p in self.pallet_assignments if p['id'] not in result_map
        ]

        self.pallet_assignments.extend(result)

    #Hàm trừ đi số lượng ở các pallet
    def get_goods(self, pallets, quantity, don_xuat, result=None):
        if result == None:
            result = []

        if not pallets:
            raise ValueError("Không đủ pallet để xuất.")
        
        pallet = pallets[0]
        
        if quantity <= pallet.so_thung_con_lai:
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": quantity
            })
            pallet.export_quantity(quantity, don_xuat, don_xuat.nguoi_tao)
            return result
        else:
            remaining = quantity - pallet.so_thung_con_lai
            result.append({
                "id": pallet.id,
                "ma_pallet": pallet.ma_pallet,
                "so_thung": pallet.so_thung_con_lai
            })
            pallet.export_quantity(pallet.so_thung_con_lai, don_xuat, don_xuat.nguoi_tao)
            return self.get_goods(pallets[1:], remaining, don_xuat, result)

