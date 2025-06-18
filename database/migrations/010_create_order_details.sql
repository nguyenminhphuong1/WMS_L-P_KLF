CREATE TABLE chi_tiet_don (
    id INT PRIMARY KEY AUTO_INCREMENT,
    don_xuat_id INT NOT NULL,
    san_pham_id INT NOT NULL, -- Nên dùng san_pham_id thay vì VARCHAR
    so_luong_can INT NOT NULL,
    pallet_assignments JSON,
    da_xuat_xong BOOLEAN DEFAULT FALSE,
    ghi_chu TEXT,
    FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id),
    FOREIGN KEY (san_pham_id) REFERENCES san_pham(id)
);
