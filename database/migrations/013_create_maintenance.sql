CREATE TABLE bao_tri (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_bao_tri VARCHAR(20) UNIQUE NOT NULL,
    tieu_de VARCHAR(200) NOT NULL,
    loai_bao_tri ENUM('Vệ_sinh', 'Sửa_chữa', 'Kiểm_tra', 'Thay_thế', 'Bảo_dưỡng') NOT NULL,
    doi_tuong ENUM('Khu_vực', 'Vị_trí', 'Thiết_bị', 'Hệ_thống') NOT NULL,
    doi_tuong_id VARCHAR(50), -- ID của khu vực, vị trí hoặc thiết bị
    mo_ta TEXT NOT NULL,
    muc_do_uu_tien ENUM('Thấp', 'Vừa', 'Cao', 'Khẩn_cấp') DEFAULT 'Vừa',
    nguoi_tao VARCHAR(50) NOT NULL,
    nguoi_thuc_hien JSON, -- ["user1", "user2"]
    thoi_gian_bat_dau DATETIME,
    thoi_gian_ket_thuc DATETIME,
    thoi_gian_uoc_tinh INT DEFAULT 0, -- giờ
    chi_phi_uoc_tinh DECIMAL(15,2) DEFAULT 0,
    chi_phi_thuc_te DECIMAL(15,2) DEFAULT 0,
    trang_thai ENUM('Kế_hoạch', 'Đang_thực_hiện', 'Hoàn_thành', 'Tạm_dừng', 'Hủy') DEFAULT 'Kế_hoạch',
    ket_qua TEXT, -- mô tả kết quả sau khi hoàn thành
    hinh_anh_truoc JSON, -- ảnh trước khi bảo trì
    hinh_anh_sau JSON, -- ảnh sau khi bảo trì
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_loai_bao_tri (loai_bao_tri),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_muc_do_uu_tien (muc_do_uu_tien)
);