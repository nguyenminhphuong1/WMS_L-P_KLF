
USE test;
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
CREATE TABLE vi_tri_kho (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_vi_tri VARCHAR(10) UNIQUE NOT NULL, -- A1, A2, B1, B2...
    khu_vuc_id INT NOT NULL,
    hang CHAR(1) NOT NULL, -- A, B, C, D, E
    cot INT NOT NULL, -- 1, 2, 3, 4, 5
    loai_vi_tri ENUM('Pallet', 'Carton', 'Bulk') DEFAULT 'Pallet',
    tai_trong_max DECIMAL(10,2) DEFAULT 0, -- kg
    chieu_cao_max DECIMAL(8,2) DEFAULT 0, -- cm
    trang_thai ENUM('Trống', 'Có_hàng', 'Bảo_trì', 'Hỏng') DEFAULT 'Trống',
    uu_tien_fifo BOOLEAN DEFAULT TRUE,
    gan_cua_ra BOOLEAN DEFAULT FALSE,
    vi_tri_cach_ly BOOLEAN DEFAULT FALSE,
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (khu_vuc_id) REFERENCES khu_vuc(id),
    UNIQUE KEY unique_hang_cot (hang, cot)
);

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
CREATE TABLE san_pham (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_san_pham VARCHAR(50) UNIQUE NOT NULL,
    ten_san_pham VARCHAR(100) NOT NULL,
    nhom_hang_id INT NOT NULL,
    thuong_hieu VARCHAR(100),
    dung_tich DECIMAL(10,2), -- ml hoặc g
    don_vi_tinh VARCHAR(20) DEFAULT 'thùng',
    so_luong_per_thung INT DEFAULT 1,
    ma_vach VARCHAR(100),
    nha_cung_cap_id INT, -- Thêm FK này để liên kết với bảng nha_cung_cap
    han_su_dung_mac_dinh INT DEFAULT 365, -- ngày
    chu_ky_kiem_tra_cl INT DEFAULT 30, -- ngày
    hinh_anh VARCHAR(255),
    mo_ta TEXT,
    trang_thai ENUM('Hoạt_động', 'Ngừng') DEFAULT 'Hoạt_động',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (nhom_hang_id) REFERENCES nhom_hang(id)
    -- FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id) -- Sẽ thêm sau khi tạo nha_cung_cap
);
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
CREATE TABLE pallets (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_pallet VARCHAR(20) UNIQUE NULL,
    san_pham_id INT NOT NULL,
    nha_cung_cap_id INT not null,
    so_thung_ban_dau INT NOT NULL,
    so_thung_con_lai INT NOT NULL,
    vi_tri_kho_id INT NOT NULL,
    ngay_san_xuat DATE NOT NULL,
    han_su_dung DATE NOT NULL,
    ngay_kiem_tra_cl DATE NOT NULL,
    trang_thai ENUM('Mới', 'Đã_mở', 'Trống') DEFAULT 'Mới',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,    
    CONSTRAINT fk_pallet_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham(id),
    CONSTRAINT fk_pallets_vi_tri_kho FOREIGN KEY (vi_tri_kho_id) REFERENCES vi_tri_kho(id),
    CONSTRAINT fk_pallets_nha_cung_cap FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id)
);
CREATE TABLE chi_tiet_vi_tri_cua_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thanh_pho VARCHAR(20) NOT NULL ,
    huyen VARCHAR(20) NOT NULL,
    xa VARCHAR(20) NOT NULL,
    dia_chi_chi_tiet VARCHAR(20) NOT NULL
);
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
CREATE TABLE don_xuat (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_don VARCHAR(20) UNIQUE NOT NULL,
    cua_hang_id INT NOT NULL,
    ngay_tao DATE NOT NULL,
    ngay_giao DATE,
    trang_thai ENUM('Chờ_xuất', 'Đang_xuất', 'Hoàn_thành', 'Hủy') DEFAULT 'Chờ_xuất',
    qr_code_data TEXT,
    da_in_qr BOOLEAN DEFAULT FALSE,
    nguoi_tao VARCHAR(50),
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cua_hang_id) REFERENCES cua_hang(id)
);
CREATE TABLE chi_tiet_don (
    id INT PRIMARY KEY AUTO_INCREMENT,
    don_xuat_id INT NOT NULL,
    san_pham_id INT NOT NULL, -- Nên dùng san_pham_id thay vì VARCHAR
    so_luong_can INT NOT NULL,
    pallet_assignments JSON,
    da_xuat_xong BOOLEAN DEFAULT FALSE,
    ghi_chu TEXT,
    FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id),
    FOREIGN KEY (san_pham_id) REFERENCES san_pham(id)
);
CREATE TABLE tinh_trang_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pallet_id INT NOT NULL,
    loai_tinh_trang ENUM('Bình_thường', 'Sắp_hết_hạn', 'Cần_kiểm_tra_CL', 'Có_vấn_đề', 'Ưu_tiên_xuất') NOT NULL,
    muc_do ENUM('Thấp', 'Vừa', 'Cao', 'Khẩn_cấp') DEFAULT 'Vừa',
    mo_ta TEXT,
    ngay_phat_hien DATE NOT NULL,
    ngay_xu_ly DATE NULL,
    nguoi_phat_hien VARCHAR(50),
    nguoi_xu_ly VARCHAR(50),
    trang_thai ENUM('Mới', 'Đang_xử_lý', 'Hoàn_thành', 'Hủy') DEFAULT 'Mới',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (pallet_id) REFERENCES pallets(id),
    INDEX idx_loai_tinh_trang (loai_tinh_trang),
    INDEX idx_trang_thai (trang_thai)
);
CREATE TABLE bao_tri (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_bao_tri VARCHAR(20) UNIQUE NOT NULL,
    tieu_de VARCHAR(200) NOT NULL,
    loai_bao_tri ENUM('Vệ_sinh', 'Sửa_chữa', 'Kiểm_tra', 'Thay_thế', 'Bảo_dưỡng') NOT NULL,
    doi_tuong ENUM('Khu_vực', 'Vị_trí', 'Thiết_bị', 'Hệ_thống') NOT NULL,
    doi_tuong_id VARCHAR(50), -- ID của khu vực, vị trí hoặc thiết bị
    mo_ta TEXT NOT NULL,
    muc_do_uu_tien ENUM('Thấp', 'Vừa', 'Cao', 'Khẩn_cấp') DEFAULT 'Vừa',
    nguoi_tao VARCHAR(50) NOT NULL,
    nguoi_thuc_hien JSON, -- ["user1", "user2"]
    thoi_gian_bat_dau DATETIME,
    thoi_gian_ket_thuc DATETIME,
    thoi_gian_uoc_tinh INT DEFAULT 0, -- giờ
    chi_phi_uoc_tinh DECIMAL(15,2) DEFAULT 0,
    chi_phi_thuc_te DECIMAL(15,2) DEFAULT 0,
    trang_thai ENUM('Kế_hoạch', 'Đang_thực_hiện', 'Hoàn_thành', 'Tạm_dừng', 'Hủy') DEFAULT 'Kế_hoạch',
    ket_qua TEXT, -- mô tả kết quả sau khi hoàn thành
    hinh_anh_truoc JSON, -- ảnh trước khi bảo trì
    hinh_anh_sau JSON, -- ảnh sau khi bảo trì
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_loai_bao_tri (loai_bao_tri),
    INDEX idx_trang_thai (trang_thai),
    INDEX idx_muc_do_uu_tien (muc_do_uu_tien)
);
CREATE TABLE log_kiem_tra_giao_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    don_xuat_id INT NOT NULL, 
    cua_hang_dich VARCHAR(100),
    cua_hang_thuc VARCHAR(100),
    ket_qua ENUM('DUNG', 'SAI', 'LOI') NOT NULL,
    ngay_kiem_tra DATETIME DEFAULT CURRENT_TIMESTAMP,
    nguoi_kiem_tra VARCHAR(50),
    vi_tri_gps VARCHAR(100),
    ghi_chu TEXT,
    INDEX idx_don_hang (don_xuat_id),
    INDEX idx_ngay_kiem_tra (ngay_kiem_tra),
    FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id)
);
CREATE TABLE cai_dat_he_thong (
    id INT PRIMARY KEY AUTO_INCREMENT,
    khoa_cai_dat VARCHAR(100) UNIQUE NOT NULL,
    gia_tri TEXT NOT NULL,
    mo_ta TEXT,
    nhom_cai_dat VARCHAR(50) DEFAULT 'Chung',
    kieu_du_lieu ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Dữ liệu mặc định cho cài đặt
INSERT INTO cai_dat_he_thong (khoa_cai_dat, gia_tri, mo_ta, nhom_cai_dat) VALUES
('canh_bao_het_han_truoc', '7', 'Cảnh báo trước bao nhiêu ngày khi hàng hết hạn', 'Cảnh_báo'),
('canh_bao_ton_kho_thap', '10', 'Cảnh báo khi tồn kho dưới ngưỡng (thùng)', 'Cảnh_báo'),
('chu_ky_kiem_ke_tu_dong', '30', 'Chu kỳ kiểm kê tự động (ngày)', 'Kiểm_kê'),
('ty_le_su_dung_kho_toi_da', '85', 'Tỷ lệ sử dụng kho tối đa (%)', 'Kho'),
('thoi_gian_lam_viec_bat_dau', '07:00', 'Giờ bắt đầu ca làm việc', 'Thời_gian'),
('thoi_gian_lam_viec_ket_thuc', '18:00', 'Giờ kết thúc ca làm việc', 'Thời_gian');