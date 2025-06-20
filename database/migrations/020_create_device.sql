CREATE TABLE thiet_bi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_thiet_bi VARCHAR(150) NOT NULL,
    danh_muc_thiet_bi_id INT,
    model VARCHAR(100),
    so_series VARCHAR(100) UNIQUE,
    nha_cung_cap_id INT,
    ngay_mua DATE,
    gia_mua DECIMAL(15,2),
    TrangThai ENUM('Hoạt động', 'Bảo trì', 'Hỏng', 'Ngừng sử dụng') DEFAULT 'Hoạt động',
    khu_vuc_id INT,
    ghi_chu TEXT,
    FOREIGN KEY (danh_muc_thiet_bi_id) REFERENCES danh_muc_thiet_bi(id),
    FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap_thiet_bi(id),
    FOREIGN KEY (khu_vuc_id) REFERENCES khu_vuc(id)
);