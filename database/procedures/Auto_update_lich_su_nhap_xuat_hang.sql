
-- Trigger tự động tạo record khi có pallet mới (NHẬP HÀNG)
DELIMITER //
CREATE TRIGGER tr_nhap_hang_pallet_moi
AFTER INSERT ON pallets
FOR EACH ROW
BEGIN
    INSERT INTO lich_su_nhap_xuat_hang (
        loai_giao_dich,
        pallet_id,
        so_luong,
        nguoi_thuc_hien,
        ngay_tao,
        gio_tao,
        trang_thai,
        ghi_chu
    ) VALUES (
        'Nhap_hang',
        NEW.id,
        NEW.so_thung_ban_dau,
        COALESCE(@current_user, 'system'),
        CURDATE(),
        CURTIME(),
        'Hoan_thanh',  -- Pallet mới tạo = đã hoàn thành nhập
        CONCAT('Nhập pallet mới: ', COALESCE(NEW.ma_pallet, 'Chưa có mã'))
    );
END//
DELIMITER ;

-- Trigger tự động tạo record khi có đơn xuất mới (XUẤT HÀNG)
DELIMITER //
CREATE TRIGGER tr_xuat_hang_don_moi
AFTER INSERT ON don_xuat
FOR EACH ROW
BEGIN
    -- Tính tổng số lượng từ chi tiết đơn
    DECLARE v_tong_so_luong INT DEFAULT 0;
    
    SELECT COALESCE(SUM(so_luong_can), 0) INTO v_tong_so_luong
    FROM chi_tiet_don 
    WHERE don_xuat_id = NEW.id;
    
    INSERT INTO lich_su_nhap_xuat_hang (
        loai_giao_dich,
        don_xuat_id,
        so_luong,
        nguoi_thuc_hien,
        ngay_tao,
        gio_tao,
        trang_thai,
        ghi_chu
    ) VALUES (
        'Xuat_hang',
        NEW.id,
        v_tong_so_luong,
        COALESCE(NEW.nguoi_tao, 'system'),
        NEW.ngay_tao,
        CURTIME(),
        'Chua_hoan_thanh',  -- Đơn mới tạo = chưa hoàn thành
        CONCAT('Tạo đơn xuất: ', NEW.ma_don)
    );
END//
DELIMITER ;

-- Trigger cập nhật trạng thái khi đơn xuất hoàn thành
DELIMITER //
CREATE TRIGGER tr_cap_nhat_trang_thai_xuat
AFTER UPDATE ON don_xuat
FOR EACH ROW
BEGIN
    IF OLD.trang_thai != NEW.trang_thai AND NEW.trang_thai = 'Hoàn_thành' THEN
        UPDATE lich_su_nhap_xuat_hang 
        SET 
            trang_thai = 'Hoan_thanh',
            ngay_hoan_thanh = CURDATE(),
            gio_hoan_thanh = CURTIME()
        WHERE don_xuat_id = NEW.id AND loai_giao_dich = 'Xuat_hang';
    END IF;
END//
DELIMITER ;

-- View để xem lịch sử với thông tin chi tiết
CREATE VIEW v_lich_su_nhap_xuat_hang AS
SELECT 
    lsnx.id,
    lsnx.loai_giao_dich,
    lsnx.trang_thai,
    lsnx.so_luong,
    lsnx.ngay_tao,
    lsnx.gio_tao,
    lsnx.ngay_hoan_thanh,
    lsnx.gio_hoan_thanh,
    lsnx.nguoi_thuc_hien,
    lsnx.ghi_chu,
    
    -- Thông tin pallet (cho nhập hàng)
    p.ma_pallet,
    sp.ma_san_pham,
    sp.ten_san_pham,
    ncc.ten_nha_cung_cap,
    
    -- Thông tin đơn xuất (cho xuất hàng)
    dx.ma_don,
    ch.ten_cua_hang,
    dx.ngay_giao,
    
    lsnx.created_at
    
FROM lich_su_nhap_xuat_hang lsnx
LEFT JOIN pallets p ON lsnx.pallet_id = p.id
LEFT JOIN san_pham sp ON p.san_pham_id = sp.id
LEFT JOIN nha_cung_cap ncc ON p.nha_cung_cap_id = ncc.id
LEFT JOIN don_xuat dx ON lsnx.don_xuat_id = dx.id
LEFT JOIN cua_hang ch ON dx.cua_hang_id = ch.id;

-- Stored procedure để thống kê nhanh
DELIMITER //
CREATE PROCEDURE sp_thong_ke_nhap_xuat(
    IN p_tu_ngay DATE,
    IN p_den_ngay DATE
)
BEGIN
    SELECT 
        DATE(ngay_tao) as ngay,
        loai_giao_dich,
        trang_thai,
        COUNT(*) as so_luong_giao_dich,
        SUM(so_luong) as tong_so_thung
    FROM lich_su_nhap_xuat_hang
    WHERE ngay_tao BETWEEN p_tu_ngay AND p_den_ngay
    GROUP BY DATE(ngay_tao), loai_giao_dich, trang_thai
    ORDER BY ngay DESC, loai_giao_dich;
END//
DELIMITER ;