CREATE TABLE log_kiem_tra (
    id INT PRIMARY KEY AUTO_INCREMENT,
    don_hang_id VARCHAR(20) NOT NULL, -- Cần xem xét nếu nên là INT don_xuat_id
    cua_hang_dich VARCHAR(100),
    cua_hang_thuc VARCHAR(100),
    ket_qua ENUM('DUNG', 'SAI', 'LOI') NOT NULL,
    ngay_kiem_tra DATETIME DEFAULT CURRENT_TIMESTAMP,
    nguoi_kiem_tra VARCHAR(50),
    vi_tri_gps VARCHAR(100),
    ghi_chu TEXT,
    INDEX idx_don_hang (don_hang_id),
    INDEX idx_ngay_kiem_tra (ngay_kiem_tra)
    -- FOREIGN KEY (don_hang_id) REFERENCES don_xuat(ma_don) -- Nếu don_hang_id là mã đơn hàng
    -- Hoặc nếu don_hang_id là id, cần thay đổi kiểu dữ liệu và thêm FK.
);