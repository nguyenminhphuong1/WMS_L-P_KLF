CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Khu vuc (Zone/Area)
CREATE INDEX idx_khu_vuc_trang_thai ON khu_vuc(trang_thai);
CREATE INDEX idx_khu_vuc_ma_khu_vuc ON khu_vuc(ma_khu_vuc);
CREATE INDEX idx_khu_vuc_ma_khu_vuc ON khu_vuc(ten_khu_vuc);

-- Vi tri kho
CREATE INDEX idx_vi_tri_kho_trang_thai ON vi_tri_kho(trang_thai);
CREATE INDEX idx_vi_tri_kho_hang_cot ON vi_tri_kho(hang, cot);
CREATE INDEX idx_vi_tri_kho_loai_vi_tri ON vi_tri_kho(loai_vi_tri);
CREATE INDEX idx_vi_tri_kho_uu_tien_fifo ON vi_tri_kho(uu_tien_fifo);

-- Nhom hang (Product groups)
CREATE INDEX idx_nhom_hang_ten ON nhom_hang(ten_nhom);
CREATE INDEX idx_nhom_hang_thu_tu_hien_thi ON nhom_hang(thu_tu_hien_thi);

-- San pham (Products)
CREATE INDEX idx_san_pham_ten_san_pham ON san_pham(ten_san_pham);

-- Nha cung cap (Suppliers)
CREATE INDEX idx_nha_cung_cap_ten ON nha_cung_cap(ten_nha_cung_cap);
CREATE INDEX idx_nha_cung_cap_ma_so_thue ON nha_cung_cap(ma_so_thue);

--INDEXES CHO PALLETS - TRUY VẤN QUAN TRỌNG NHẤT
-- Business logic indexes
CREATE INDEX idx_pallets_trang_thai ON pallets(trang_thai);
CREATE INDEX idx_pallets_han_su_dung ON pallets(han_su_dung);
CREATE INDEX idx_pallets_ngay_kiem_tra_cl ON pallets(ngay_kiem_tra_cl);
CREATE INDEX idx_pallets_so_thung_con_lai ON pallets(so_thung_con_lai);

--INDEXES CHO CỬA HÀNG VÀ ĐỊA CHỈ
CREATE INDEX idx_cua_hang_dia_chi_thanh_pho ON chi_tiet_vi_tri_cua_hang(thanh_pho);

-- 4. INDEXES CHO ĐỚN XUẤT - QUAN TRỌNG CHO WORKFLOW
CREATE INDEX idx_don_xuat_nguoi_tao_don_xuat_id ON don_xuat(nguoi_tao_don_xuat_id);
CREATE INDEX idx_don_xuat_ngay_tao ON don_xuat(ngay_tao);
CREATE INDEX idx_don_xuat_ngay_giao ON don_xuat(ngay_giao);


-- Composite index cho workflow đơn xuất
CREATE INDEX idx_don_xuat_status_date ON don_xuat(trang_thai, ngay_tao);
CREATE INDEX idx_don_xuat_shop_status ON don_xuat(cua_hang_id, trang_thai);

-- Chi tiết đơn
CREATE INDEX idx_chi_tiet_don_da_xuat_xong ON chi_tiet_don(da_xuat_xong);

-- Composite index cho picking process
CREATE INDEX idx_chi_tiet_don_order_product ON chi_tiet_don(don_xuat_id, san_pham_id,so_luong_can);

-- Index cho tinh_trang_pallet
CREATE INDEX idx_tinh_trang_pallet_alert ON tinh_trang_pallet(loai_tinh_trang, muc_do, trang_thai);
