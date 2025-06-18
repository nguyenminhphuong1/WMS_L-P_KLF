CREATE TABLE chi_tiet_kiem_ke (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kiem_ke_id INT NOT NULL,
    pallet_id INT NOT NULL,
    -- Thông tin trước kiểm kê (từ hệ thống - snapshot tại thời điểm tạo phiên kiểm kê)
    so_thung_he_thong INT NOT NULL, -- lấy từ pallets.so_thung_con_lai
    han_su_dung_he_thong DATE NOT NULL, -- lấy từ pallets.han_su_dung
    trang_thai_he_thong ENUM('Mới', 'Đã_mở', 'Trống') NOT NULL, -- lấy từ pallets.trang_thai
    
    -- Thông tin thực tế (sau kiểm kê)
    so_thung_thuc_te INT,
    han_su_dung_thuc_te DATE,
    trang_thai_thuc_te ENUM('Mới', 'Đã_mở', 'Trống', 'Hỏng', 'Mất'),
    tinh_trang_chat_luong ENUM('Tốt', 'Khá', 'Trung_bình', 'Kém', 'Hỏng') DEFAULT 'Tốt',
    
    -- Kết quả kiểm kê
    chenh_lech_so_luong INT GENERATED ALWAYS AS (so_thung_thuc_te - so_thung_he_thong) STORED,
    
    -- Thông tin kiểm kê
    thoi_gian_kiem_ke DATETIME,
    hinh_anh JSON, -- ảnh chụp trong quá trình kiểm kê
    ghi_chu TEXT,
    da_xu_ly_chenh_lech BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (kiem_ke_id) REFERENCES kiem_ke(id),
    FOREIGN KEY (pallet_id) REFERENCES pallets(id),
    
    INDEX idx_phien_kiem_ke (kiem_ke_id),
    INDEX idx_thoi_gian_kiem_ke (thoi_gian_kiem_ke)
);