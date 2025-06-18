CREATE TABLE don_xuat (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_don VARCHAR(20) UNIQUE NOT NULL,
    cua_hang_id INT NOT NULL,
    ngay_tao DATE NOT NULL,
    ngay_giao DATE,
    trang_thai ENUM('Chờ_xuất', 'Đang_xuất', 'Hoàn_thành', 'Hủy') DEFAULT 'Chờ_xuất',
    qr_code_data TEXT,
    da_in_qr BOOLEAN DEFAULT FALSE,
    nguoi_tao VARCHAR(50),
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cua_hang_id) REFERENCES cua_hang(id)
);