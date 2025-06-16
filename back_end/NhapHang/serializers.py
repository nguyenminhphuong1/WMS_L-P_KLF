from rest_framework import serializers
from .models import Pallets

class PalletsSerializers(serializers.ModelSerializer):
    class Meta:
        model = Pallets
        fields = '__all__'
        read_only_fields = ['created_at', 'updated_at']
    
    def validate(self, attrs):
        so_thung_ban_dau = attrs.get('so_thung_ban_dau')
        so_thung_con_lai = attrs.get('so_thung_con_lai')

        if so_thung_ban_dau is None or so_thung_con_lai is None:
            raise serializers.ValidationError("Cần nhập cả số thùng ban đầu và số thùng còn lại.")

        if so_thung_ban_dau < so_thung_con_lai:
            raise serializers.ValidationError("Số thùng ban đầu không được nhỏ hơn số thùng còn lại.")

        return attrs
