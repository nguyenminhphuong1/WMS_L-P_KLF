CREATE TABLE khu_vuc (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_khu_vuc VARCHAR(10) UNIQUE NOT NULL, -- A, B, C, D
    ten_khu_vuc VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    kich_thuoc_hang INT NOT NULL, -- số hàng
    kich_thuoc_cot INT NOT NULL, -- số cột
    tai_trong_max DECIMAL(10,2) DEFAULT 0, -- kg
    nhiet_do_min DECIMAL(5,2) DEFAULT 0, -- °C
    nhiet_do_max DECIMAL(5,2) DEFAULT 40, -- °C
    do_am_min DECIMAL(5,2) DEFAULT 0, -- %
    do_am_max DECIMAL(5,2) DEFAULT 100, -- %
    trang_thai ENUM('Hoạt_động', 'Bảo_trì', 'Ngừng') DEFAULT 'Hoạt_động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);