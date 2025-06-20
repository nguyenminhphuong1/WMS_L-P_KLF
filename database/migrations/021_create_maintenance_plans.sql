CREATE TABLE ke_hoach_bao_tri (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thiet_bi_id INT NOT NULL,
    loai_bao_tri VARCHAR(100),
    ngay_du_kien DATE NOT NULL,
    chu_ky_bao_tri ENUM('Hàng tuần',' Hàng tháng','Hàng năm','Đột xuất'), -- Số ngày giữa các lần bảo trì
    trang_thai ENUM('Chưa thực hiện', 'Đã thực hiện', 'Quá hạn') DEFAULT 'Chưa thực hiện',
    ghi_chu TEXT,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (thiet_bi_id) REFERENCES thiet_bi(id)
);