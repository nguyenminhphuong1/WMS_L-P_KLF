CREATE TABLE kiem_ke (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_kiem_ke VARCHAR(20) UNIQUE NOT NULL, -- KK2024001, KK2024002...
    loai_kiem_ke ENUM('Toàn bộ', 'Theo khu vực', 'Theo sản phẩm', 'Theo nhóm hàng', 'Đột xuất', 'Theo HSD') NOT NULL,
    pham_vi_kiem_ke JSON, -- { khu_vuc: ["A", "B"], nhom_hang: [1,2,3], tu_ngay: "2025-01-01", den_ngay: "2025-12-31"}
    nguoi_kiem_ke INT NOT NULL,
    nguoi_phu_trach JSON, -- ["user1", "user2"] - danh sách người thực hiện kiểm kê
    trang_thai ENUM('Chuẩn bị', 'Đang thực hiện', 'Hoàn thành', 'Tạm dừng', 'Hủy') DEFAULT 'Chuẩn bị',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_kiem_ke) REFERENCES users(id),
    KEY idx_loai_kiem_ke (loai_kiem_ke),
    KEY idx_trang_thai (trang_thai)
);