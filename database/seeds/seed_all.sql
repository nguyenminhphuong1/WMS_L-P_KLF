-- Dữ liệu cho bảng 'roles'
INSERT INTO roles (role_name) VALUES
('Admin'),
('Quản lý kho'),
('Nhân viên kho'),
('Nhân viên xuất nhập'),
('Khách hàng');

---

-- Dữ liệu cho bảng 'users'
-- Lưu ý: password_hash là một chuỗi băm giả định, trong thực tế bạn cần sử dụng hàm băm mạnh (ví dụ: BCrypt)
INSERT INTO users (username, password_hash, full_name, email, role_id, status) VALUES
('admin_user', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstu', 'Nguyễn Văn Admin', 'admin@example.com', 1, TRUE),
('qlkho01', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstu', 'Trần Thị Quản Lý', 'quanlykho@example.com', 2, TRUE),
('nvkho01', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstu', 'Lê Văn Kho', 'nhanvienkho@example.com', 3, TRUE),
('nvxuatnhap01', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstu', 'Phạm Thị Giao Nhận', 'xuatnhap@example.com', 4, TRUE),
('khachhang01', '$2a$10$abcdefghijklmnopqrstuvwxyz1234567890abcdefghijklmnopqrstu', 'Đỗ Văn Khách', 'khachhang@example.com', 5, TRUE);

---

-- Dữ liệu cho bảng 'permissions'
INSERT INTO permissions (permission_name, url_cho_phep, description) VALUES
('Quản lý người dùng', '/admin/users', 'Cho phép quản lý thông tin người dùng'),
('Quản lý vai trò', '/admin/roles', 'Cho phép quản lý các vai trò và phân quyền'),
('Xem tồn kho', '/warehouse/inventory', 'Cho phép xem thông tin tồn kho'),
('Nhập hàng', '/warehouse/receive', 'Cho phép thực hiện các thao tác nhập hàng'),
('Xuất hàng', '/warehouse/dispatch', 'Cho phép thực hiện các thao tác xuất hàng'),
('Quản lý khu vực kho', '/warehouse/areas', 'Cho phép quản lý các khu vực trong kho'),
('Quản lý vị trí kho', '/warehouse/locations', 'Cho phép quản lý các vị trí cụ thể trong kho'),
('Xem báo cáo', '/reports', 'Cho phép truy cập các báo cáo tổng hợp'),
('Quản lý sản phẩm', '/products', 'Cho phép quản lý danh mục sản phẩm'),
('Quản lý nhà cung cấp', '/suppliers', 'Cho phép quản lý thông tin nhà cung cấp'),
('Quản lý kiểm kê', '/inventory/audit', 'Cho phép quản lý các phiên kiểm kê'),
('Quản lý thiết bị', '/equipment', 'Cho phép quản lý các thiết bị trong kho'),
('Quản lý bảo trì', '/maintenance', 'Cho phép quản lý kế hoạch và lịch sử bảo trì');

---

-- Dữ liệu cho bảng 'role_permissions'
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10), (1, 11), (1, 12), (1, 13), -- Admin có tất cả
(2, 3), (2, 4), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9), (2, 10), (2, 11), (2, 12), (2, 13), -- Quản lý kho
(3, 3), (3, 4), (3, 5), (3, 11), -- Nhân viên kho: xem tồn, nhập, xuất, kiểm kê
(4, 3), (4, 4), (4, 5), -- Nhân viên xuất nhập: xem tồn, nhập, xuất
(5, 3); -- Khách hàng: chỉ xem tồn kho

---

-- Dữ liệu cho bảng 'khu_vuc'
INSERT INTO khu_vuc (ma_khu_vuc, ten_khu_vuc, mo_ta, nhiet_do_min, nhiet_do_max, do_am_min, do_am_max, trang_thai) VALUES
('A', 'Khu vực Đông Lạnh', 'Khu vực lưu trữ hàng hóa cần nhiệt độ thấp', -25.00, -18.00, 60.00, 80.00, 'Hoạt_động'),
('B', 'Khu vực Mát', 'Khu vực lưu trữ hàng hóa cần nhiệt độ mát', 2.00, 8.00, 70.00, 90.00, 'Hoạt_động'),
('C', 'Khu vực Thường', 'Khu vực lưu trữ hàng hóa thông thường', 18.00, 25.00, 50.00, 70.00, 'Hoạt_động'),
('D', 'Khu vực Cách Ly', 'Khu vực dành cho hàng hóa chờ xử lý hoặc kiểm tra', 15.00, 30.00, 40.00, 80.00, 'Hoạt_động'),
('E', 'Khu vực Hàng Nguy Hiểm', 'Khu vực riêng biệt cho hàng dễ cháy nổ, độc hại', 20.00, 25.00, 40.00, 60.00, 'Hoạt_động');

---

-- Dữ liệu cho bảng 'vi_tri_kho'
-- Giả định khu_vuc_id từ 1 đến 5 tương ứng với các khu vực trên
INSERT INTO vi_tri_kho (khu_vuc_id, hang, cot, loai_vi_tri, tai_trong_max, chieu_cao_max, trang_thai, uu_tien_fifo, gan_cua_ra, vi_tri_cach_ly, ghi_chu) VALUES
(1, 'A', 1, 'Pallet', 1000.00, 250.00, 'Trống', TRUE, FALSE, FALSE, 'Vị trí A1 khu đông lạnh'),
(1, 'A', 2, 'Pallet', 1000.00, 250.00, 'Trống', TRUE, FALSE, FALSE, 'Vị trí A2 khu đông lạnh'),
(2, 'B', 1, 'Carton', 200.00, 150.00, 'Trống', TRUE, TRUE, FALSE, 'Vị trí B1 khu mát, gần cửa ra'),
(3, 'C', 1, 'Pallet', 800.00, 200.00, 'Trống', TRUE, FALSE, FALSE, 'Vị trí C1 khu thường'),
(3, 'C', 2, 'Pallet', 800.00, 200.00, 'Trống', TRUE, FALSE, FALSE, 'Vị trí C2 khu thường'),
(3, 'C', 3, 'Bulk', 5000.00, 300.00, 'Trống', FALSE, FALSE, FALSE, 'Vị trí C3 khu thường, lưu trữ số lượng lớn'),
(4, 'D', 1, 'Pallet', 500.00, 200.00, 'Trống', FALSE, FALSE, TRUE, 'Vị trí D1 khu cách ly');

---

-- Dữ liệu cho bảng 'nhom_hang'
INSERT INTO nhom_hang (ma_nhom, ten_nhom, mo_ta, icon, mau_sac, yeu_cau_nhiet_do_min, yeu_cau_nhiet_do_max, yeu_cau_do_am_min, yeu_cau_do_am_max, tranh_anh_sang, tranh_rung_dong, hang_de_vo, hang_nguy_hiem) VALUES
('DONG_LANH', 'Hàng đông lạnh', 'Các sản phẩm cần bảo quản ở nhiệt độ đông lạnh', '❄️', '#00BFFF', -25.00, -18.00, 60.00, 80.00, TRUE, FALSE, FALSE, FALSE),
('MAT', 'Hàng mát', 'Các sản phẩm cần bảo quản ở nhiệt độ mát', '🧊', '#87CEEB', 2.00, 8.00, 70.00, 90.00, TRUE, FALSE, FALSE, FALSE),
('DO_HOP', 'Đồ hộp & Đồ khô', 'Các sản phẩm đóng hộp, thực phẩm khô', '🥫', '#FFD700', 18.00, 25.00, 50.00, 70.00, FALSE, FALSE, FALSE, FALSE),
('DIEN_TU', 'Thiết bị điện tử', 'Các thiết bị điện tử, cần tránh rung động', '⚡', '#FF4500', 20.00, 30.00, 40.00, 60.00, TRUE, TRUE, TRUE, FALSE),
('HOA_CHAT', 'Hóa chất', 'Các sản phẩm hóa chất, có thể nguy hiểm', '🧪', '#800080', 20.00, 25.00, 40.00, 60.00, TRUE, FALSE, FALSE, TRUE);

---

-- Dữ liệu cho bảng 'nha_cung_cap'
INSERT INTO nha_cung_cap (ma_nha_cung_cap, ten_nha_cung_cap, dia_chi, so_dien_thoai, email, nguoi_lien_he, so_dien_thoai_lien_he, email_lien_he, ma_so_thue, loai_hang_cung_cap, xep_hang, trang_thai) VALUES
('NCC001', 'Công ty Thực phẩm A', '123 Đường Nguyễn Huệ, TP.HCM', '0901234567', 'contact@foodA.com', 'Nguyễn Thị B', '0901234568', 'nguyenthib@foodA.com', '0301234567', '["Thịt đông lạnh", "Thủy hải sản"]', 'A', 'Hoạt_động'),
('NCC002', 'Công ty Đồ uống B', '456 Đường Lê Lợi, Hà Nội', '0987654321', 'info@drinkB.com', 'Trần Văn C', '0987654322', 'tranvanc@drinkB.com', '0109876543', '["Nước ngọt", "Bia"]', 'B', 'Hoạt_động'),
('NCC003', 'Công ty Điện tử X', '789 Đường Hai Bà Trưng, Đà Nẵng', '0912345678', 'sales@electronicX.com', 'Lê Thị D', '0912345679', 'lethid@electronicX.com', '0401234567', '["Điện thoại", "Máy tính bảng"]', 'C', 'Hoạt_động');

---

-- Dữ liệu cho bảng 'san_pham'
-- Giả định nhom_hang_id từ 1 đến 5 tương ứng với các nhóm hàng trên
INSERT INTO san_pham (ma_san_pham, ten_san_pham, nhom_hang_id, thuong_hieu, dung_tich, don_vi_tinh, so_luong_per_thung, ma_vach, nha_cung_cap_id, han_su_dung_mac_dinh, chu_ky_kiem_tra_cl, trang_thai) VALUES
('SP001', 'Thịt bò nhập khẩu', 1, 'MeatCo', 10.00, 'kg', 1, '8934567890123', 1, 365, 90, 'Hoạt_động'),
('SP002', 'Sữa tươi tiệt trùng', 2, 'DairyFarm', 1.00, 'lít', 12, '8931234567890', 2, 180, 30, 'Hoạt_động'),
('SP003', 'Cá hộp sardines', 3, 'OceanFoods', 0.20, 'kg', 24, '8939876543210', 1, 730, 60, 'Hoạt_động'),
('SP004', 'Điện thoại thông minh X', 4, 'TechGiant', 0.50, 'cái', 1, '1234567890123', 3, 730, 180, 'Hoạt_động'),
('SP005', 'Nước ngọt Cola', 2, 'CoolDrink', 0.33, 'lít', 24, '8930000000001', 2, 365, 30, 'Hoạt_động');


---

-- Dữ liệu cho bảng 'pallets'
-- Giả định nguoi_tao_pallet_id là 3 (nhân viên kho)
-- Giả định vi_tri_kho_id 1-7 đã có sẵn
-- Giả định san_pham_id 1-5 và nha_cung_cap_id 1-3 đã có sẵn
INSERT INTO pallets (ma_pallet, san_pham_id, nha_cung_cap_id, so_thung_ban_dau, so_thung_con_lai, vi_tri_kho_id, nguoi_tao_pallet_id, ngay_san_xuat, han_su_dung, ngay_kiem_tra_cl, trang_thai) VALUES
('PL001', 1, 1, 50, 50, 1, 3, '2025-05-01', '2026-05-01', '2025-06-01', 'Mới'),
('PL002', 2, 2, 100, 100, 2, 3, '2025-06-10', '2025-12-10', '2025-07-10', 'Mới'),
('PL003', 3, 1, 75, 75, 3, 3, '2024-11-15', '2026-11-15', '2025-06-15', 'Mới'),
('PL004', 5, 2, 120, 120, 4, 3, '2025-06-01', '2026-06-01', '2025-07-01', 'Mới'),
('PL005', 1, 1, 40, 30, 1, 3, '2025-04-20', '2026-04-20', '2025-05-20', 'Đã_mở'); -- Pallet đã mở

---

-- Dữ liệu cho bảng 'chi_tiet_vi_tri_cua_hang'
INSERT INTO chi_tiet_vi_tri_cua_hang (thanh_pho, huyen, xa, dia_chi_chi_tiet) VALUES
('Hồ Chí Minh', 'Quận 1', 'Phường Bến Nghé', '123 Lê Lợi'),
('Hồ Chí Minh', 'Quận 3', 'Phường 6', '456 Hai Bà Trưng'),
('Hà Nội', 'Hoàn Kiếm', 'Phường Tràng Tiền', '789 Đinh Tiên Hoàng');

---

-- Dữ liệu cho bảng 'cua_hang'
-- Giả định dia_chi_id từ 1 đến 3 đã có sẵn
INSERT INTO cua_hang (ma_cua_hang, ten_cua_hang, so_dien_thoai, dia_chi_id, trang_thai) VALUES
('CH001', 'Cửa hàng Trung tâm Sài Gòn', '0281234567', 1, 'Hoạt_động'),
('CH002', 'Cửa hàng Đống Đa Hà Nội', '0249876543', 3, 'Hoạt_động'),
('CH003', 'Cửa hàng Quận 3', '0287654321', 2, 'Hoạt_động');

---

-- Dữ liệu cho bảng 'don_xuat'
-- Giả định cua_hang_id từ 1 đến 3 và nguoi_tao_don_xuat_id là 4 (nhân viên xuất nhập)
INSERT INTO don_xuat (ma_don, cua_hang_id, ngay_tao, ngay_giao, trang_thai, da_in_qr, nguoi_tao_don_xuat_id, ghi_chu) VALUES
('DX2025001', 1, '2025-06-18', '2025-06-19', 'Hoàn_thành', TRUE, 4, 'Đơn hàng cho đợt khuyến mãi'),
('DX2025002', 2, '2025-06-19', NULL, 'Chờ_xuất', FALSE, 4, 'Đơn hàng thông thường'),
('DX2025003', 1, '2025-06-19', NULL, 'Đang_xuất', TRUE, 4, 'Đơn hàng khẩn cấp');

---

-- Dữ liệu cho bảng 'chi_tiet_don'
-- Giả định don_xuat_id từ 1 đến 3 và san_pham_id từ 1 đến 5
INSERT INTO chi_tiet_don (don_xuat_id, san_pham_id, so_luong_can, da_xuat_xong) VALUES
(1, 1, 10, TRUE), -- DX2025001: 10kg Thịt bò
(1, 2, 24, TRUE), -- DX2025001: 24l Sữa tươi (2 thùng)
(2, 3, 12, FALSE), -- DX2025002: 12 cá hộp
(3, 5, 48, FALSE); -- DX2025003: 48 chai nước ngọt (2 thùng)

---

-- Dữ liệu cho bảng 'tinh_trang_pallet'
-- Giả định pallet_id từ 1 đến 5 đã có sẵn
INSERT INTO tinh_trang_pallet (pallet_id, loai_tinh_trang, muc_do, mo_ta, ngay_phat_hien, ngay_xu_ly, nguoi_phat_hien, nguoi_xu_ly, trang_thai) VALUES
(1, 'Bình_thường', 'Thấp', 'Pallet mới nhập, tình trạng tốt', '2025-06-18', NULL, 'nvkho01', NULL, 'Hoàn_thành'),
(2, 'Sắp_hết_hạn', 'Vừa', 'Sản phẩm sữa tươi sắp hết hạn trong 3 tháng', '2025-06-19', NULL, 'nvkho01', NULL, 'Mới'),
(3, 'Cần_kiểm_tra_CL', 'Cao', 'Pallet cá hộp tồn kho lâu, cần kiểm tra chất lượng', '2025-06-19', NULL, 'nvkho01', NULL, 'Mới'),
(5, 'Có_vấn_đề', 'Khẩn_cấp', 'Pallet đã mở, thiếu 10 thùng so với ban đầu', '2025-06-19', NULL, 'nvkho01', NULL, 'Mới');

---

-- Dữ liệu cho bảng 'kiem_ke'
-- Giả định nguoi_kiem_ke là 2 (quản lý kho)
INSERT INTO kiem_ke (ma_kiem_ke, loai_kiem_ke, pham_vi_kiem_ke, nguoi_kiem_ke, nguoi_phu_trach, trang_thai) VALUES
('KK2025001', 'Toàn bộ', '{}', 2, '["nvkho01", "nvkho02"]', 'Đang thực hiện'),
('KK2025002', 'Theo khu vực', '{"khu_vuc": ["A"]}', 2, '["nvkho01"]', 'Chuẩn bị'),
('KK2025003', 'Theo HSD', '{"den_ngay": "2025-09-30"}', 2, '["nvkho01"]', 'Chuẩn bị');

---

-- Dữ liệu cho bảng 'chi_tiet_kiem_ke'
-- Giả định kiem_ke_id và pallet_id đã tồn tại
INSERT INTO chi_tiet_kiem_ke (kiem_ke_id, pallet_id, so_thung_he_thong, han_su_dung_he_thong, trang_thai_he_thong, so_thung_thuc_te, han_su_dung_thuc_te, trang_thai_thuc_te, tinh_trang_chat_luong, thoi_gian_kiem_ke, ghi_chu, da_xu_ly_chenh_lech) VALUES
(1, 1, 50, '2026-05-01', 'Mới', 50, '2026-05-01', 'Mới', 'Tốt', '2025-06-19 10:00:00', 'Đúng số lượng, HSD', TRUE),
(1, 5, 30, '2026-04-20', 'Đã_mở', 28, '2026-04-20', 'Đã_mở', 'Trung_bình', '2025-06-19 10:30:00', 'Thiếu 2 thùng, vỏ thùng hơi móp', FALSE),
(2, 2, 100, '2025-12-10', 'Mới', 100, '2025-12-10', 'Mới', 'Tốt', '2025-06-19 11:00:00', 'Kiểm kê khu vực A, pallet sữa tươi', TRUE);

---

-- Dữ liệu cho bảng 'danh_muc_thiet_bi'
INSERT INTO danh_muc_thiet_bi (ten_danh_muc_thiet_bi, mo_ta) VALUES
('Xe nâng điện', 'Xe nâng dùng trong kho'),
('Xe đẩy hàng', 'Thiết bị hỗ trợ di chuyển hàng hóa nhẹ'),
('Máy quét mã vạch', 'Thiết bị đọc mã vạch sản phẩm'),
('Hệ thống lạnh', 'Hệ thống làm mát và đông lạnh');

---

-- Dữ liệu cho bảng 'nha_cung_cap_thiet_bi'
INSERT INTO nha_cung_cap_thiet_bi (ten_ncc, dia_chi, so_dien_thoai, email) VALUES
('Công ty TNHH Thiết Bị Kho Việt Nam', '100 CMT8, Q3, TP.HCM', '02838123456', 'info@tbkho.vn'),
('Công ty Cổ phần Công Nghệ Mới', '200 Giải Phóng, Hà Nội', '02437654321', 'contact@cnmoi.vn');

---

-- Dữ liệu cho bảng 'thiet_bi'
-- Giả định danh_muc_thiet_bi_id từ 1 đến 4, nha_cung_cap_id từ 1 đến 2, khu_vuc_id từ 1 đến 5
INSERT INTO thiet_bi (ten_thiet_bi, danh_muc_thiet_bi_id, model, so_series, nha_cung_cap_id, ngay_mua, gia_mua, TrangThai, khu_vuc_id, ghi_chu) VALUES
('Xe nâng điện Forklift XL-2000', 1, 'XL-2000', 'SN-XL2000-001', 1, '2023-01-15', 250000000.00, 'Hoạt động', 3, 'Xe nâng chính cho khu thường'),
('Máy quét mã vạch Honeywell', 3, '1900GSR-2', 'SN-HW-1900-005', 2, '2024-03-10', 5000000.00, 'Hoạt động', NULL, 'Dùng cho mọi khu vực'),
('Hệ thống lạnh Khu A', 4, 'ColdMaster 5000', 'SN-CM-5000-A', 1, '2022-07-01', 1500000000.00, 'Hoạt động', 1, 'Hệ thống làm lạnh chính khu vực A'),
('Xe đẩy hàng chịu lực', 2, 'HeavyDuty Cart 100', 'SN-HDC-010', 2, '2024-05-01', 1500000.00, 'Hoạt động', 3, 'Xe đẩy cho hàng nặng khu thường');

---

-- Dữ liệu cho bảng 'ke_hoach_bao_tri'
-- Giả định thiet_bi_id từ 1 đến 4
INSERT INTO ke_hoach_bao_tri (thiet_bi_id, loai_bao_tri, ngay_du_kien, chu_ky_bao_tri, trang_thai, ghi_chu) VALUES
(1, 'Kiểm tra định kỳ', '2025-07-01', 'Hàng tháng', 'Chưa thực hiện', 'Kiểm tra dầu nhớt, hệ thống điện'),
(3, 'Bảo dưỡng lớn', '2025-09-15', 'Hàng năm', 'Chưa thực hiện', 'Kiểm tra và nạp gas, vệ sinh toàn bộ hệ thống'),
(2, 'Kiểm tra pin', '2025-06-25', 'Hàng tuần', 'Chưa thực hiện', 'Kiểm tra dung lượng pin và kết nối');

---

-- Dữ liệu cho bảng 'log_kiem_tra_giao_hang'
-- Giả định don_xuat_id từ 1 đến 3
INSERT INTO log_kiem_tra_giao_hang (don_xuat_id, cua_hang_dich, cua_hang_thuc, ket_qua, ngay_kiem_tra, nguoi_kiem_tra, vi_tri_gps, ghi_chu) VALUES
(1, 'Cửa hàng Trung tâm Sài Gòn', 'Cửa hàng Trung tâm Sài Gòn', 'DUNG', '2025-06-19 14:00:00', 'nvxuatnhap01', '10.762622,106.660172', 'Giao đúng địa điểm và hàng hóa'),
(2, 'Cửa hàng Đống Đa Hà Nội', 'Cửa hàng Đống Đa Hà Nội', 'SAI', '2025-06-19 15:30:00', 'nvxuatnhap01', '21.027764,105.834160', 'Sai 1 mặt hàng so với đơn hàng');

---

-- Dữ liệu cho bảng 'log_lich_su_bao_tri'
INSERT INTO log_lich_su_bao_tri (loai_bao_tri, ngay_bao_tri, noi_dung_bao_tri, chi_phi, nguoi_thuc_hien, trang_thai) VALUES
('Bảo trì định kỳ', '2025-06-10', 'Bảo trì xe nâng định kỳ quý 2', 500000.00, 'Kỹ thuật viên A', 'Đã hoàn thành'),
('Sửa chữa', '2025-05-20', 'Thay thế cảm biến nhiệt độ hệ thống lạnh', 2500000.00, 'Kỹ thuật viên B', 'Đã hoàn thành');

---

-- Dữ liệu cho bảng 'lich_su_nhap_xuat_hang'
-- Giả định pallet_id từ 1 đến 5 và don_xuat_id từ 1 đến 3
INSERT INTO lich_su_nhap_xuat_hang (loai_giao_dich, trang_thai, pallet_id, don_xuat_id, so_luong, ghi_chu, nguoi_thuc_hien, ngay_tao, gio_tao, ngay_hoan_thanh, gio_hoan_thanh) VALUES
('Nhap_hang', 'Hoan_thanh', 1, NULL, 50, 'Nhập lô thịt bò mới', 'nvkho01', '2025-06-01', '09:00:00', '2025-06-01', '09:30:00'),
('Nhap_hang', 'Hoan_thanh', 2, NULL, 100, 'Nhập lô sữa tươi', 'nvkho01', '2025-06-10', '10:00:00', '2025-06-10', '10:45:00'),
('Xuat_hang', 'Hoan_thanh', NULL, 1, 10, 'Xuất thịt bò cho đơn DX2025001', 'nvxuatnhap01', '2025-06-18', '11:00:00', '2025-06-18', '11:30:00'),
('Xuat_hang', 'Chua_hoan_thanh', NULL, 2, 12, 'Xuất cá hộp cho đơn DX2025002', 'nvxuatnhap01', '2025-06-19', '14:00:00', NULL, NULL);

---

INSERT INTO cai_dat_he_thong (khoa_cai_dat, gia_tri, mo_ta, nhom_cai_dat) VALUES
('canh_bao_het_han_truoc', '7', 'Cảnh báo trước bao nhiêu ngày khi hàng hết hạn', 'Cảnh_báo'),
('canh_bao_ton_kho_thap', '10', 'Cảnh báo khi tồn kho dưới ngưỡng (thùng)', 'Cảnh_báo'),
('chu_ky_kiem_ke_tu_dong', '30', 'Chu kỳ kiểm kê tự động (ngày)', 'Kiểm_kê'),
('ty_le_su_dung_kho_toi_da', '85', 'Tỷ lệ sử dụng kho tối đa (%)', 'Kho'),
('thoi_gian_lam_viec_bat_dau', '07:00', 'Giờ bắt đầu ca làm việc', 'Thời_gian'),
('thoi_gian_lam_viec_ket_thuc', '18:00', 'Giờ kết thúc ca làm việc', 'Thời_gian');
