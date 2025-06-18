CREATE TABLE lich_su_thay_doi (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bang_du_lieu VARCHAR(50) NOT NULL,
    ban_ghi_id BIGINT NOT NULL,
    hanh_dong ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    du_lieu_cu JSON,
    du_lieu_moi JSON,
    cac_truong_thay_doi JSON,
    nguoi_thuc_hien VARCHAR(50),
    ip_address VARCHAR(45),
    ly_do_thay_doi TEXT,
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_bang_du_lieu (bang_du_lieu),
    INDEX idx_ban_ghi_id (ban_ghi_id),
    INDEX idx_nguoi_thuc_hien (nguoi_thuc_hien),
    INDEX idx_thoi_gian (thoi_gian),
    INDEX idx_hanh_dong (hanh_dong)
);