"use client"

import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Package } from "lucide-react"
import { toast } from 'react-toastify';

// ...existing code...

export const ThemTinhTrangHang = ({ palletId, tinhTrangHienTai, onSuccess, onCancel }) => {
  const [form, setForm] = useState({
    pallet: palletId || "",
    loai_tinh_trang: "",
    muc_do: "Vừa",
    mo_ta: "",
    ngay_phat_hien: "",
    ngay_xu_ly: "",
    nguoi_phat_hien: "",
    nguoi_xu_ly: "",
    trang_thai: "Mới",
    ghi_chu: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (tinhTrangHienTai) {
      setForm({
        pallet: palletId,
        loai_tinh_trang: tinhTrangHienTai.loai_tinh_trang || "",
        muc_do: tinhTrangHienTai.muc_do || "Vừa",
        mo_ta: tinhTrangHienTai.mo_ta || "",
        ngay_phat_hien: tinhTrangHienTai.ngay_phat_hien || "",
        ngay_xu_ly: tinhTrangHienTai.ngay_xu_ly || "",
        nguoi_phat_hien: tinhTrangHienTai.nguoi_phat_hien || "",
        nguoi_xu_ly: tinhTrangHienTai.nguoi_xu_ly || "",
        trang_thai: tinhTrangHienTai.trang_thai || "Mới",
        ghi_chu: tinhTrangHienTai.ghi_chu || "",
      });
    } else {
      setForm(f => ({ ...f, pallet: palletId }));
    }
  }, [tinhTrangHienTai, palletId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.loai_tinh_trang) newErrors.loai_tinh_trang = "Chọn loại tình trạng";
    if (!form.muc_do) newErrors.muc_do = "Chọn mức độ";
    if (!form.ngay_phat_hien) newErrors.ngay_phat_hien = "Nhập ngày phát hiện";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
        if (tinhTrangHienTai && tinhTrangHienTai.id) {
        // Sửa: dùng PUT
        await axios.put(`http://localhost:8000/quanlykho/tinhtranghang/${tinhTrangHienTai.id}/`, form);
        toast.success("Cập nhật tình trạng thành công!");
        } else {
        // Thêm mới: dùng POST
        await axios.post("http://localhost:8000/quanlykho/tinhtranghang/", form);
        toast.success("Thêm tình trạng thành công!");
        }
        if (onSuccess) onSuccess();
    } catch (err) {
        toast.error("Lưu thất bại: " + (err.response?.data?.detail || err.message));
    }
    };

  return (
    <form onSubmit={handleSubmit} className="tinhtrang-form">
      <div className="form-row">
        <div className="form-group">
          <label>Loại tình trạng *</label>
          <select
            name="loai_tinh_trang"
            value={form.loai_tinh_trang}
            onChange={handleChange}
            className={errors.loai_tinh_trang ? "error" : ""}
          >
            <option value="">-- Chọn --</option>
            <option value="Bình_thường">Bình thường</option>
            <option value="Sắp_hết_hạn">Sắp hết hạn</option>
            <option value="Cần_kiểm_tra_CL">Cần kiểm tra CL</option>
            <option value="Có_vấn_đề">Có vấn đề</option>
            <option value="Ưu_tiên_xuất">Ưu tiên xuất</option>
          </select>
          {errors.loai_tinh_trang && <span className="error-text">{errors.loai_tinh_trang}</span>}
        </div>
        <div className="form-group">
          <label>Mức độ *</label>
          <select
            name="muc_do"
            value={form.muc_do}
            onChange={handleChange}
            className={errors.muc_do ? "error" : ""}
          >
            <option value="Thấp">Thấp</option>
            <option value="Vừa">Vừa</option>
            <option value="Cao">Cao</option>
            <option value="Khẩn_cấp">Khẩn cấp</option>
          </select>
          {errors.muc_do && <span className="error-text">{errors.muc_do}</span>}
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Ngày phát hiện *</label>
          <input
            type="date"
            name="ngay_phat_hien"
            value={form.ngay_phat_hien}
            onChange={handleChange}
            className={errors.ngay_phat_hien ? "error" : ""}
          />
          {errors.ngay_phat_hien && <span className="error-text">{errors.ngay_phat_hien}</span>}
        </div>
        <div className="form-group">
          <label>Ngày xử lý</label>
          <input
            type="date"
            name="ngay_xu_ly"
            value={form.ngay_xu_ly}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Người phát hiện</label>
          <input
            type="text"
            name="nguoi_phat_hien"
            value={form.nguoi_phat_hien}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Người xử lý</label>
          <input
            type="text"
            name="nguoi_xu_ly"
            value={form.nguoi_xu_ly}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Mô tả</label>
        <textarea
          name="mo_ta"
          value={form.mo_ta}
          onChange={handleChange}
          rows={2}
        />
      </div>
      <div className="form-group">
        <label>Ghi chú</label>
        <textarea
          name="ghi_chu"
          value={form.ghi_chu}
          onChange={handleChange}
          rows={2}
        />
      </div>
      <div className="form-group">
        <label>Trạng thái</label>
        <select
          name="trang_thai"
          value={form.trang_thai}
          onChange={handleChange}
        >
          <option value="Mới">Mới</option>
          <option value="Đang_xử_lý">Đang xử lý</option>
          <option value="Hoàn_thành">Hoàn thành</option>
          <option value="Hủy">Hủy</option>
        </select>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>Hủy</button>
        <button type="submit" className="btn btn-primary">
            {tinhTrangHienTai ? "Cập nhật" : "Thêm tình trạng"}
        </button>
        </div>
    </form>
  );
};


export default ThemTinhTrangHang
