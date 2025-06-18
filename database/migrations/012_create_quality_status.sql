CREATE TABLE tinh_trang_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pallet_id INT NOT NULL,
    loai_tinh_trang ENUM('Bình_thường', 'Sắp_hết_hạn', 'Cần_kiểm_tra_CL', 'Có_vấn_đề', 'Ưu_tiên_xuất') NOT NULL,
    muc_do ENUM('Thấp', 'Vừa', 'Cao', 'Khẩn_cấp') DEFAULT 'Vừa',
    mo_ta TEXT,
    ngay_phat_hien DATE NOT NULL,
    ngay_xu_ly DATE NULL,
    nguoi_phat_hien VARCHAR(50),
    nguoi_xu_ly VARCHAR(50),
    trang_thai ENUM('Mới', 'Đang_xử_lý', 'Hoàn_thành', 'Hủy') DEFAULT 'Mới',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pallet_id) REFERENCES pallets(id),
    INDEX idx_loai_tinh_trang (loai_tinh_trang),
    INDEX idx_trang_thai (trang_thai)
);