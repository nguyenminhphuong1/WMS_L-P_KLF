CREATE TABLE cai_dat_he_thong (
    id INT PRIMARY KEY AUTO_INCREMENT,
    khoa_cai_dat VARCHAR(100) UNIQUE NOT NULL,
    gia_tri TEXT NOT NULL,
    mo_ta TEXT,
    nhom_cai_dat VARCHAR(50) DEFAULT 'Chung',
    kieu_du_lieu ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mặc định cho cài đặt
INSERT INTO cai_dat_he_thong (khoa_cai_dat, gia_tri, mo_ta, nhom_cai_dat) VALUES
('canh_bao_het_han_truoc', '7', 'Cảnh báo trước bao nhiêu ngày khi hàng hết hạn', 'Cảnh_báo'),
('canh_bao_ton_kho_thap', '10', 'Cảnh báo khi tồn kho dưới ngưỡng (thùng)', 'Cảnh_báo'),
('chu_ky_kiem_ke_tu_dong', '30', 'Chu kỳ kiểm kê tự động (ngày)', 'Kiểm_kê'),
('ty_le_su_dung_kho_toi_da', '85', 'Tỷ lệ sử dụng kho tối đa (%)', 'Kho'),
('thoi_gian_lam_viec_bat_dau', '07:00', 'Giờ bắt đầu ca làm việc', 'Thời_gian'),
('thoi_gian_lam_viec_ket_thuc', '18:00', 'Giờ kết thúc ca làm việc', 'Thời_gian');