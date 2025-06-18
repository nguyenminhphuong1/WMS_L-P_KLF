CREATE TABLE lich_su_nhap_xuat (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    loai_giao_dich ENUM('Nhập', 'Xuất', 'Chuyển_kho', 'Kiểm_kê', 'Hủy') NOT NULL,
    pallet_id INT,
    san_pham_id INT NOT NULL,
    so_luong_thay_doi INT NOT NULL,             -- Số lượng tăng (+) hoặc giảm (-)
    so_luong_truoc INT,
    so_luong_sau INT,
    vi_tri_truoc_id INT,                        -- Vị trí cũ (cho chuyển kho)
    vi_tri_sau_id INT,                          -- Vị trí mới
    don_xuat_id INT,                            -- Liên kết đến đơn xuất (nếu có)
    ma_phieu VARCHAR(50),                       -- Mã phiếu nhập/xuất
    nguoi_thuc_hien VARCHAR(50) NOT NULL,
    ly_do TEXT,
    ghi_chu TEXT,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pallet_id) REFERENCES pallets(id),
    FOREIGN KEY (san_pham_id) REFERENCES san_pham(id),
    FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id),
    INDEX idx_loai_giao_dich (loai_giao_dich),
    INDEX idx_san_pham_thoi_gian (san_pham_id, thoi_gian),
    INDEX idx_nguoi_thuc_hien (nguoi_thuc_hien)
);