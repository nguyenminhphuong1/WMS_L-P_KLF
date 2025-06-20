-- Dữ liệu cho bảng 'roles'
INSERT INTO roles (role_name) VALUES
('Admin'),
('Quản lý kho'),
('Nhân viên kho'),
('Khách hàng');

---

-- Dữ liệu cho bảng 'users'
-- Lưu ý: password_hash là một chuỗi băm giả định, trong thực tế bạn cần sử dụng hàm băm mạnh (ví dụ: BCrypt)
INSERT INTO users (username, password_hash, full_name, email, role_id, status) VALUES
('admin_user', '123', 'Nguyễn Văn Admin', 'admin@example.com', 1, TRUE),
('Hay', '123', 'Trần Thị Hay', 'quanlykho@example.com', 2, TRUE),
('nvkho01', '123', 'Lê Văn Kho', 'nhanvienkho@example.com', 3, TRUE),
('nvxuatnhap01', '123', 'Phạm Thị Giao Nhận', 'xuatnhap@example.com', 4, TRUE),
('khachhang01', '123', 'Đỗ Văn Khách', 'khachhang@example.com', 5, TRUE);

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
