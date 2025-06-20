CREATE TABLE lich_su_nhap_xuat_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Thông tin cơ bản
    loai_giao_dich ENUM('Nhap_hang', 'Xuat_hang') NOT NULL,
    trang_thai ENUM('Chua_hoan_thanh', 'Hoan_thanh') DEFAULT 'Chua_hoan_thanh',
    
    -- Liên kết với các bảng chính
    pallet_id INT,                          -- Cho nhập hàng (khi tạo pallet mới)
    don_xuat_id INT,                        -- Cho xuất hàng (khi tạo đơn xuất mới)
    
    -- Thông tin bổ sung
    so_luong INT NOT NULL,                  -- Số lượng thùng
    ghi_chu TEXT,                           -- Ghi chú
    
    -- Thông tin người thực hiện
    nguoi_thuc_hien VARCHAR(50) NOT NULL,
    
    -- Thời gian
    ngay_tao DATE NOT NULL,
    gio_tao TIME NOT NULL,
    ngay_hoan_thanh DATE,
    gio_hoan_thanh TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Indexes
    INDEX idx_loai_giao_dich (loai_giao_dich),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_pallet_id (pallet_id),
    INDEX idx_don_xuat_id (don_xuat_id),
    INDEX idx_ngay_tao (ngay_tao),
    INDEX idx_nguoi_thuc_hien (nguoi_thuc_hien)
);