CREATE TABLE cai_dat_he_thong (
    id INT PRIMARY KEY AUTO_INCREMENT,
    khoa_cai_dat VARCHAR(100) UNIQUE NOT NULL,
    gia_tri TEXT NOT NULL,
    mo_ta TEXT,
    nhom_cai_dat VARCHAR(50) DEFAULT 'Chung',
    kieu_du_lieu ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);