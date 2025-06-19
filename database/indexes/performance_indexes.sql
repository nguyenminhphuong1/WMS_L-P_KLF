1. INDEXES CHO CÁC FOREIGN KEY RELATIONSHIPS
-- Tối ưu cho JOIN operations và referential integrity

-- Users table
CREATE INDEX idx_users_role_id ON users(role_id);

-- Vi tri kho (Warehouse positions)
CREATE INDEX idx_vi_tri_kho_khu_vuc_id ON vi_tri_kho(khu_vuc_id);

-- San pham (Products)
CREATE INDEX idx_san_pham_nhom_hang_id ON san_pham(nhom_hang_id);
CREATE INDEX idx_san_pham_nha_cung_cap_id ON san_pham(nha_cung_cap_id);

-- 2. INDEXES CHO PALLETS - TRUY VẤN QUAN TRỌNG NHẤT
-- Pallets là bảng core của hệ thống kho

-- Foreign key indexes
CREATE INDEX idx_pallets_san_pham_id ON pallets(san_pham_id);
CREATE INDEX idx_pallets_nha_cung_cap_id ON pallets(nha_cung_cap_id);
CREATE INDEX idx_pallets_vi_tri_kho_id ON pallets(vi_tri_kho_id);
CREATE INDEX idx_pallets_nguoi_tao_pallet_id ON pallets(nguoi_tao_pallet_id);

-- 3. INDEXES CHO CỬA HÀNG VÀ ĐỊA CHỈ
CREATE INDEX idx_cua_hang_dia_chi_id ON cua_hang(dia_chi_id);

-- 4. INDEXES CHO ĐỚN XUẤT - QUAN TRỌNG CHO WORKFLOW
CREATE INDEX idx_don_xuat_cua_hang_id ON don_xuat(cua_hang_id);

-- 5. INDEXES CHO TÌNH TRẠNG PALLET - QUAN TRỌNG CHO ALERTS
CREATE INDEX idx_tinh_trang_pallet_pallet_id ON tinh_trang_pallet(pallet_id);
CREATE INDEX idx_tinh_trang_pallet_loai_tinh_trang ON tinh_trang_pallet(loai_tinh_trang);
CREATE INDEX idx_tinh_trang_pallet_muc_do ON tinh_trang_pallet(muc_do);
CREATE INDEX idx_tinh_trang_pallet_trang_thai ON tinh_trang_pallet(trang_thai);
CREATE INDEX idx_tinh_trang_pallet_ngay_phat_hien ON tinh_trang_pallet(ngay_phat_hien);

-- Chi tiết đơn xuat
CREATE INDEX idx_chi_tiet_don_don_xuat_id ON chi_tiet_don(don_xuat_id);
CREATE INDEX idx_chi_tiet_don_san_pham_id ON chi_tiet_don(san_pham_id);

-- Index cho tinh_trang_pallet
CREATE INDEX idx_tinh_trang_pallet_alert ON tinh_trang_pallet(loai_tinh_trang, muc_do, trang_thai);

-- Index cho chi_tiet_kiem_ke
CREATE INDEX idx_chi_tiet_kiem_ke_pallet_id ON chi_tiet_kiem_ke(pallet_id);
CREATE INDEX idx_chi_tiet_kiem_ke_kiem_ke_id ON chi_tiet_kiem_ke(kiem_ke_id);

--Index cho thiet_bi
CREATE INDEX idx_thiet_bi_danh_muc_thiet_bi_id ON chi_tiet_kiem_ke(danh_muc_thiet_bi_id);
CREATE INDEX idx_thiet_bi_nha_cung_cap_id ON chi_tiet_kiem_ke(nha_cung_cap_id);
CREATE INDEX idx_thiet_bi_khu_vuc_id ON chi_tiet_kiem_ke(khu_vuc_id);

