CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    role_name VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    email VARCHAR(100),
    role_id INT,
    status BOOLEAN DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);
CREATE TABLE permissions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    permission_name VARCHAR(100) NOT null,
    url_cho_phep varchar(100) not null,
    description varchar(50)
);
CREATE TABLE role_permissions (
    role_id INT,
    permission_id INT,
    PRIMARY KEY (role_id, permission_id),
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (permission_id) REFERENCES permissions(id)
);
CREATE TABLE khu_vuc (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ma_khu_vuc VARCHAR(10) UNIQUE NOT NULL, -- A, B, C, D
    ten_khu_vuc VARCHAR(100) NOT NULL,-- cá, đông lạnh
    mo_ta TEXT,
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
    nguoi_tao_pallet_id INT not null,
    ngay_san_xuat DATE NOT NULL,
    han_su_dung DATE NOT NULL,
    ngay_kiem_tra_cl DATE NOT NULL,
    trang_thai ENUM('Mới', 'Đã_mở', 'Trống') DEFAULT 'Mới',
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,  
    CONSTRAINT fk_pallet_nguoi FOREIGN KEY (nguoi_tao_pallet_id) REFERENCES users(id),
    CONSTRAINT fk_pallet_san_pham FOREIGN KEY (san_pham_id) REFERENCES san_pham(id),
    CONSTRAINT fk_pallets_vi_tri_kho FOREIGN KEY (vi_tri_kho_id) REFERENCES vi_tri_kho(id),
    CONSTRAINT fk_pallets_nha_cung_cap FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap(id)
);
CREATE TABLE chi_tiet_vi_tri_cua_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    thanh_pho VARCHAR(20) NOT NULL ,
    huyen VARCHAR(20) NOT NULL,
    xa VARCHAR(20) NOT NULL,
    dia_chi_chi_tiet VARCHAR(20) 
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
    da_in_qr BOOLEAN DEFAULT FALSE,
    nguoi_tao_don_xuat_id INT not NULL,
    ghi_chu TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (nguoi_tao_don_xuat_id) REFERENCES users(id),
    FOREIGN KEY (cua_hang_id) REFERENCES cua_hang(id)
);
CREATE TABLE chi_tiet_don (
    id INT PRIMARY KEY AUTO_INCREMENT,
    don_xuat_id INT NOT NULL,
    san_pham_id INT NOT NULL, -- Nên dùng san_pham_id thay vì VARCHAR
    so_luong_can INT NOT NULL,
    da_xuat_xong BOOLEAN DEFAULT FALSE,
    ghi_chu TEXT,
    FOREIGN KEY (don_xuat_id) REFERENCES don_xuat(id),
    FOREIGN KEY (san_pham_id) REFERENCES san_pham(id)
);
CREATE TABLE tinh_trang_pallet (
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
    FOREIGN KEY (pallet_id) REFERENCES pallets(id)
);
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
    FOREIGN KEY (nguoi_kiem_ke) REFERENCES users(id)
);
-- Bảng chi tiết kiểm kê từng pallet
CREATE TABLE chi_tiet_kiem_ke (
    id INT PRIMARY KEY AUTO_INCREMENT,
    kiem_ke_id INT NOT NULL,
    pallet_id INT NOT NULL,
    -- Thông tin trước kiểm kê (từ hệ thống - snapshot tại thời điểm tạo phiên kiểm kê)
    so_thung_he_thong INT NOT NULL, -- lấy từ pallets.so_thung_con_lai
    han_su_dung_he_thong DATE NOT NULL, -- lấy từ pallets.han_su_dung
    trang_thai_he_thong ENUM('Mới', 'Đã_mở', 'Trống') NOT NULL, -- lấy từ pallets.tinh_trang_pallet

    -- Thông tin thực tế (sau kiểm kê)
    so_thung_thuc_te INT,
    han_su_dung_thuc_te DATE,
    trang_thai_thuc_te ENUM('Mới', 'Đã_mở', 'Trống', 'Hỏng', 'Mất'),
    tinh_trang_chat_luong ENUM('Tốt', 'Khá', 'Trung_bình', 'Kém', 'Hỏng') DEFAULT 'Tốt',
    
    -- Kết quả kiểm kê
    chenh_lech_so_luong INT GENERATED ALWAYS AS (so_thung_thuc_te - so_thung_he_thong) STORED,
    
    -- Thông tin kiểm kê
    thoi_gian_kiem_ke DATETIME,
    hinh_anh JSON, -- ảnh chụp trong quá trình kiểm kê
    ghi_chu TEXT,
    da_xu_ly_chenh_lech BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (kiem_ke_id) REFERENCES kiem_ke(id),
    FOREIGN KEY (pallet_id) REFERENCES pallets(id)
);
CREATE TABLE danh_muc_thiet_bi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_danh_muc_thiet_bi VARCHAR(100) NOT NULL,
    mo_ta TEXT,
    ngay_tao DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng nhà cung cấp
CREATE TABLE nha_cung_cap_thiet_bi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_ncc VARCHAR(150) NOT NULL,
    dia_chi VARCHAR(255),
    so_dien_thoai VARCHAR(20) not NULL,
    email VARCHAR(100)
);

-- Bảng thiết bị
CREATE TABLE thiet_bi (
    id INT PRIMARY KEY AUTO_INCREMENT,
    ten_thiet_bi VARCHAR(150) NOT NULL,
    danh_muc_thiet_bi_id INT,
    model VARCHAR(100),
    so_series VARCHAR(100) UNIQUE,
    nha_cung_cap_id INT,
    ngay_mua DATE,
    gia_mua DECIMAL(15,2),
    TrangThai ENUM('Hoạt động', 'Bảo trì', 'Hỏng', 'Ngừng sử dụng') DEFAULT 'Hoạt động',
    khu_vuc_id INT,
    ghi_chu TEXT,
    FOREIGN KEY (danh_muc_thiet_bi_id) REFERENCES danh_muc_thiet_bi(id),
    FOREIGN KEY (nha_cung_cap_id) REFERENCES nha_cung_cap_thiet_bi(id),
    FOREIGN KEY (khu_vuc_id) REFERENCES khu_vuc(id)
);

-- Bảng kế hoạch bảo trì
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
CREATE TABLE log_kiem_tra_giao_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    don_xuat_id INT NOT NULL, 
    cua_hang_dich VARCHAR(100),
    cua_hang_thuc VARCHAR(100),
    ket_qua ENUM('DUNG', 'SAI', 'LOI') NOT NULL,
    ngay_kiem_tra DATETIME DEFAULT CURRENT_TIMESTAMP,
    nguoi_kiem_tra VARCHAR(50),
    vi_tri_gps VARCHAR(100),
    ghi_chu TEXT
);
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

-- Bảng lịch sử nhập xuất hàng đơn giản
CREATE TABLE lich_su_nhap_xuat_hang (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Thông tin cơ bản
    loai_giao_dich ENUM('Nhap_hang', 'Xuat_hang') NOT NULL,
    trang_thai ENUM('Chua_hoan_thanh', 'Hoan_thanh') DEFAULT 'Chua_hoan_thanh',
    
    -- Liên kết với các bảng chính
    pallet_id INT,                          -- Cho nhập hàng (khi tạo pallet mới)
    don_xuat_id INT,                        -- Cho xuất hàng (khi tạo đơn xuất mới)
    
    -- Thông tin bổ sung
    so_luong INT NOT NULL,                  -- Số lượng thùng
    ghi_chu TEXT,                           -- Ghi chú
    
    -- Thông tin người thực hiện
    nguoi_thuc_hien VARCHAR(50) NOT NULL,
    
    -- Thời gian
    ngay_tao DATE NOT NULL,
    gio_tao TIME NOT NULL,
    ngay_hoan_thanh DATE,
    gio_hoan_thanh TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
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
    thoi_gian TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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
