
-- ==============================================
-- STORED PROCEDURES TIỆN ÍCH
-- ==============================================

DELIMITER //

-- Tự động tạo lịch bảo trì tiếp theo
CREATE PROCEDURE TaoLichBaoTriTiepTheo(IN lich_id INT)
BEGIN
    DECLARE chu_ky INT;
    DECLARE lan_cuoi DATETIME;
    
    SELECT m.chu_ky_ngay, l.lan_bao_tri_cuoi 
    INTO chu_ky, lan_cuoi
    FROM lich_bao_tri_dinh_ky l
    JOIN mau_bao_tri m ON l.mau_bao_tri_id = m.id
    WHERE l.id = lich_id;
    
    UPDATE lich_bao_tri_dinh_ky 
    SET lan_bao_tri_tiep_theo = DATE_ADD(IFNULL(lan_cuoi, NOW()), INTERVAL chu_ky DAY)
    WHERE id = lich_id;
END //

-- Lấy danh sách công việc bảo trì sắp tới
CREATE PROCEDURE LayDanhSachBaoTriSapToi(IN so_ngay_truoc INT)
BEGIN
    SELECT 
        l.id,
        m.ten_mau,
        l.doi_tuong,
        l.doi_tuong_id,
        l.lan_bao_tri_tiep_theo,
        m.muc_do_uu_tien,
        m.thoi_gian_uoc_tinh,
        m.loai_bao_tri
    FROM lich_bao_tri_dinh_ky l
    JOIN mau_bao_tri m ON l.mau_bao_tri_id = m.id
    WHERE l.kich_hoat = TRUE 
    AND m.kich_hoat = TRUE
    AND l.lan_bao_tri_tiep_theo <= DATE_ADD(NOW(), INTERVAL so_ngay_truoc DAY)
    ORDER BY l.lan_bao_tri_tiep_theo ASC;
END //

DELIMITER ;

-- ==============================================
-- VIEWS TIỆN ÍCH
-- ==============================================

-- View thống kê bảo trì theo tháng
CREATE VIEW thong_ke_bao_tri_thang AS
SELECT 
    YEAR(thoi_gian_bat_dau) as nam,
    MONTH(thoi_gian_bat_dau) as thang,
    loai_bao_tri,
    COUNT(*) as so_luong,
    AVG(chi_phi_thuc_te) as chi_phi_trung_binh,
    SUM(chi_phi_thuc_te) as tong_chi_phi
FROM bao_tri 
WHERE trang_thai = 'Hoàn_thành'
GROUP BY YEAR(thoi_gian_bat_dau), MONTH(thoi_gian_bat_dau), loai_bao_tri;

-- View danh sách thiết bị cần bảo trì
CREATE VIEW thiet_bi_can_bao_tri AS
SELECT 
    tb.ma_thiet_bi,
    tb.ten_thiet_bi,
    tb.loai_thiet_bi,
    vt.ma_vi_tri,
    l.lan_bao_tri_tiep_theo,
    m.ten_mau,
    m.muc_do_uu_tien,
    DATEDIFF(l.lan_bao_tri_tiep_theo, NOW()) as ngay_con_lai
FROM thiet_bi tb
JOIN lich_bao_tri_dinh_ky l ON l.doi_tuong = 'Thiết_bị' AND l.doi_tuong_id = tb.id
JOIN mau_bao_tri m ON l.mau_bao_tri_id = m.id
LEFT JOIN vi_tri_kho vt ON tb.vi_tri_id = vt.id
WHERE l.kich_hoat = TRUE 
AND m.kich_hoat = TRUE
AND l.lan_bao_tri_tiep_theo <= DATE_ADD(NOW(), INTERVAL 7 DAY);

-- ==============================================
-- INDEXES BỔ SUNG
-- ==============================================

