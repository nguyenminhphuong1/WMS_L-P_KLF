CREATE TABLE nha_cung_cap (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_nha_cung_cap VARCHAR(20) UNIQUE NOT NULL,
    ten_nha_cung_cap VARCHAR(200) NOT NULL,
    dia_chi TEXT,
    so_dien_thoai VARCHAR(20),
    email VARCHAR(100),
    nguoi_lien_he VARCHAR(100),
    so_dien_thoai_lien_he VARCHAR(20),
    email_lien_he VARCHAR(100),
    ma_so_thue VARCHAR(50),
    loai_hang_cung_cap JSON, -- ["Bia", "Nước ngọt", "Nước suối"]
    xep_hang ENUM('A', 'B', 'C', 'D') DEFAULT 'B',
    trang_thai ENUM('Hoạt_động', 'Tạm_dừng', 'Ngừng') DEFAULT 'Hoạt_động',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);