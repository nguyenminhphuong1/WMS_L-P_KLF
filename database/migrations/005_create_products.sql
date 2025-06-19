CREATE TABLE san_pham (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_san_pham VARCHAR(50) UNIQUE NOT NULL,
    ten_san_pham VARCHAR(100) NOT NULL,
    nhom_hang_id INT NOT NULL,
    thuong_hieu VARCHAR(100),
    dung_tich DECIMAL(10,2), -- ml hoặc g
    don_vi_tinh VARCHAR(20) DEFAULT 'thùng',
    so_luong_per_thung INT DEFAULT 1,
    ma_vach VARCHAR(100),
    nha_cung_cap_id INT, -- Thêm FK này để liên kết với bảng nha_cung_cap
    han_su_dung_mac_dinh INT DEFAULT 365, -- ngày
    chu_ky_kiem_tra_cl INT DEFAULT 30, -- ngày
    hinh_anh VARCHAR(255),
    mo_ta TEXT,
    trang_thai ENUM('Hoạt_động', 'Ngừng') DEFAULT 'Hoạt_động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nhom_hang_id) REFERENCES nhom_hang(id)
    -- FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id) -- Sẽ thêm sau khi tạo nha_cung_cap
);