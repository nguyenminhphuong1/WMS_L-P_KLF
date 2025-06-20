CREATE TABLE nhom_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_nhom VARCHAR(20) UNIQUE NOT NULL,
    ten_nhom VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    icon VARCHAR(50), -- emoji hoặc icon class
    mau_sac VARCHAR(7), -- hex color code
    yeu_cau_nhiet_do_min DECIMAL(5,2),
    yeu_cau_nhiet_do_max DECIMAL(5,2),
    yeu_cau_do_am_min DECIMAL(5,2),
    yeu_cau_do_am_max DECIMAL(5,2),
    tranh_anh_sang BOOLEAN DEFAULT FALSE,
    tranh_rung_dong BOOLEAN DEFAULT FALSE,
    hang_de_vo BOOLEAN DEFAULT FALSE,
    hang_nguy_hiem BOOLEAN DEFAULT FALSE,
    thu_tu_hien_thi INT DEFAULT 0,
    trang_thai ENUM('Hoạt_động', 'Ngừng') DEFAULT 'Hoạt_động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);