CREATE TABLE pallets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_pallet VARCHAR(20) UNIQUE NULL,
    san_pham_id INT NOT NULL,
    so_thung_ban_dau INT NOT NULL,
    so_thung_con_lai INT NOT NULL,
    vi_tri_kho_id INT NOT NULL,
    ngay_san_xuat DATE NOT NULL,
    han_su_dung DATE NOT NULL,
    ngay_kiem_tra_cl DATE NOT NULL,
    trang_thai ENUM('Mới', 'Đã_mở', 'Trống') DEFAULT 'Mới',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
    CONSTRAINT fk_pallet_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham(id),
    CONSTRAINT fk_pallets_vi_tri_kho FOREIGN KEY (vi_tri_kho_id) REFERENCES vi_tri_kho(id)
);
