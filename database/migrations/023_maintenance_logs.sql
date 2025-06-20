CREATE TABLE log_lich_su_bao_tri (
    id INT PRIMARY KEY AUTO_INCREMENT,
    loai_bao_tri ENUM('Bảo trì định kỳ', 'Sửa chữa', 'Thay thế linh kiện') NOT NULL,
    ngay_bao_tri DATE NOT NULL,
    noi_dung_bao_tri TEXT,
    chi_phi DECIMAL(12,2),
    nguoi_thuc_hien VARCHAR(100),
    trang_thai ENUM('Đã hoàn thành', 'Đang thực hiện', 'Đã hủy') DEFAULT 'Đã hoàn thành',
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);