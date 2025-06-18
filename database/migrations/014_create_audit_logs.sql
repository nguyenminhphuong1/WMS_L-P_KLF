CREATE TABLE lich_su_thay_doi (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bang_du_lieu VARCHAR(50) NOT NULL,           -- Tên bảng bị thay đổi
    ban_ghi_id INT NOT NULL,                     -- ID của record
    hanh_dong ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    du_lieu_cu JSON,                             -- Dữ liệu trước khi thay đổi
    du_lieu_moi JSON,                            -- Dữ liệu sau khi thay đổi
    cac_truong_thay_doi JSON,                    -- Danh sách field đã thay đổi
    nguoi_thuc_hien VARCHAR(50),                 -- User thực hiện thay đổi
    ip_address VARCHAR(45),                      -- IP address
    ly_do_thay_doi TEXT,                         -- Lý do thay đổi (optional)
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bang_du_lieu (bang_du_lieu),
    INDEX idx_ban_ghi_id (ban_ghi_id),
    INDEX idx_nguoi_thuc_hien (nguoi_thuc_hien),
    INDEX idx_thoi_gian (thoi_gian),
    INDEX idx_hanh_dong (hanh_dong)
) PARTITION BY RANGE (YEAR(thoi_gian)) (
    PARTITION p2024 VALUES LESS THAN (2025),
    PARTITION p2025 VALUES LESS THAN (2026),
    PARTITION p2026 VALUES LESS THAN (2027),
    PARTITION p_future VALUES LESS THAN MAXVALUE
);