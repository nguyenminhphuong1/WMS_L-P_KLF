CREATE TABLE vi_tri_kho (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_vi_tri VARCHAR(10) UNIQUE NOT NULL, -- A1, A2, B1, B2...
    khu_vuc_id INT NOT NULL,
    hang CHAR(1) NOT NULL, -- A, B, C, D, E
    cot INT NOT NULL, -- 1, 2, 3, 4, 5
    loai_vi_tri ENUM('Pallet', 'Carton', 'Bulk') DEFAULT 'Pallet',
    tai_trong_max DECIMAL(10,2) DEFAULT 0, -- kg
    chieu_cao_max DECIMAL(8,2) DEFAULT 0, -- cm
    trang_thai ENUM('Trống', 'Có_hàng', 'Bảo_trì', 'Hỏng') DEFAULT 'Trống',
    uu_tien_fifo BOOLEAN DEFAULT TRUE,
    gan_cua_ra BOOLEAN DEFAULT FALSE,
    vi_tri_cach_ly BOOLEAN DEFAULT FALSE,
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (khu_vuc_id) REFERENCES khu_vuc(id),
    UNIQUE KEY unique_hang_cot (hang, cot)
);
