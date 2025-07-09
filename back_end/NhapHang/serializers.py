from rest_framework import serializers
from .models import Pallets
from django.db import transaction

class PalletsSerializers(serializers.ModelSerializer):
    ten_san_pham = serializers.CharField(source='san_pham.ten_san_pham', read_only=True)
    ten_nha_cung_cap = serializers.CharField(source='nha_cung_cap.ten_nha_cung_cap', read_only=True)
    ma_vi_tri_kho = serializers.CharField(source='vi_tri_kho.ma_vi_tri', read_only=True)

    class Meta:
        model = Pallets
        fields = [
            'id',
            'ma_pallet', 
            'san_pham', 
            'ten_san_pham',
            'nha_cung_cap',
            'ten_nha_cung_cap',
            'so_thung_ban_dau', 
            'so_thung_con_lai', 
            'vi_tri_kho', 
            'ma_vi_tri_kho',  
            'ngay_san_xuat', 
            'han_su_dung', 
            'ngay_kiem_tra_cl', 
            'trang_thai',
            'ghi_chu',
            'created_at', 
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        so_thung_ban_dau = attrs.get('so_thung_ban_dau')
        so_thung_con_lai = attrs.get('so_thung_con_lai')

        if so_thung_ban_dau is None or so_thung_con_lai is None:
            raise serializers.ValidationError("Cần nhập cả số thùng ban đầu và số thùng còn lại.")

        if so_thung_ban_dau < so_thung_con_lai:
            raise serializers.ValidationError("Số thùng ban đầu không được nhỏ hơn số thùng còn lại.")

        return attrs
    
    def create(self, validated_data):
        with transaction.atomic():
            instance = super().create(validated_data)
            user = self.context['request'].user
            try:
                instance.vi_tri_kho.assign_pallet(instance, user)
            except Exception as e:
                raise serializers.ValidationError({"pallet": str(e)})
        
        return instance
    
    def update(self, instance , validated_data):
        with transaction.atomic():
            vi_tri_cu = instance.vi_tri_kho
            vi_tri_moi = validated_data.get('vi_tri_kho', vi_tri_cu)
            ly_do = validated_data.get('ghi_chu', '')
            user = self.context['request'].user

            instance = super().update(instance, validated_data)
            try:
                if vi_tri_moi != vi_tri_cu:
                    vi_tri_cu.remove_pallet(user, ly_do)
                    vi_tri_moi.assign_pallet(instance, user) 
            except Exception as e:
                raise serializers.ValidationError({"pallet": str(e)})     
        
        return instance
