CREATE TABLE cua_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_cua_hang VARCHAR(20) UNIQUE NOT NULL,
    ten_cua_hang VARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15),
    dia_chi_id INT,
    trang_thai ENUM('Hoạt_động', 'Tạm_dừng') DEFAULT 'Hoạt_động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (dia_chi_id) REFERENCES chi_tiet_vi_tri_cua_hang(id)
);