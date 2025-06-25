"use client"

import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Package } from "lucide-react"

const SuaPallet = ({ pallet, onSubmit, onCancel, nextPalletCode, onSuccess }) => {
    const [formData, setFormData] = useState(pallet || {});
  
    useEffect(() => {
        if (pallet) {
        setFormData(pallet);
        }
    }, [pallet]);            

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const [dropdownData, setDropdownData] = useState({
    ds_vi_tri_kho: [],
    ds_nha_cung_cap: [],
    ds_san_pham: [],
  });

  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    axios.get('http://localhost:8000/nhaphang/pallets/drop_down/') 
      .then((res) => {
        setDropdownData(res.data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu dropdown:', err);
      });
  }, []);


  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.ma_pallet) newErrors.ma_pallet = "Vui lòng nhập mã pallet"
    if (!formData.ten_san_pham) newErrors.ten_san_pham = "Vui lòng nhập tên sản phẩm"
    if (!formData.so_thung_ban_dau || formData.so_thung_ban_dau <= 0) newErrors.so_thung_ban_dau = "Số lượng phải lớn hơn 0"
    if (!formData.ngay_san_xuat) newErrors.ngay_san_xuat = "Vui lòng nhập ngày sản xuất"
    if (!formData.han_su_dung) newErrors.han_su_dung = "Vui lòng nhập hạn sử dụng"
    if (!formData.vi_tri_kho) newErrors.vi_tri_kho = "Vui lòng nhập vị trí"
    if (!formData.nha_cung_cap) newErrors.nha_cung_cap = "Vui lòng nhập nhà cung cấp"

    // Kiểm tra logic ngày tháng
    if (formData.ngay_san_xuat && formData.han_su_dung) {
      if (new Date(formData.ngay_san_xuat) >= new Date(formData.han_su_dung)) {
        newErrors.expiryDate = "Hạn sử dụng phải sau ngày sản xuất"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    if (!validateForm()) {
        return;
    }
      e.preventDefault();
      const payload = {
          ma_pallet: formData.ma_pallet,
          san_pham: formData.san_pham,
          nha_cung_cap: formData.nha_cung_cap,
          so_thung_ban_dau: formData.so_thung_ban_dau,
          so_thung_con_lai: formData.so_thung_con_lai,
          vi_tri_kho: formData.vi_tri_kho,
          ngay_san_xuat: formData.ngay_san_xuat,
          han_su_dung: formData.han_su_dung,
          ngay_kiem_tra_cl: formData.ngay_kiem_tra_cl,
          trang_thai: formData.trang_thai || 'Mới',
          ghi_chu: formData.ghi_chu || '',
      };
  
      try {
        const res = await axios.put(`http://localhost:8000/nhaphang/pallets/${formData.id}/`, payload);
        alert('Sửa thành công!');
        onSuccess(res.data)
      } catch (err) {
        alert('Sửa thất bại! '+ (err.response?.data?.detail || err.message));
      }
    };

  return (
    <form onSubmit={handleSubmit} className="pallet-form">
      <div className="form-section">
        <h4 className="section-title">
          <Package size={16} />
          Thông tin cơ bản
        </h4>

        <div className="form-row">
          {/* <div className="form-group">
            <label className="form-label">Mã Pallet</label>
            <input type="text" className="form-input" value={nextPalletCode} disabled />
          </div> */}
          <div className="form-group">
            <label className="form-label">Mã Pallet *</label>
            <input
              type="text"
              name="ma_pallet"
              className={`form-input ${errors.ma_pallet ? "error" : ""}`}
              value={formData.ma_pallet}
              onChange={handleChange}
              placeholder="Nhập mã sản phẩm"
            />
            {errors.ma_pallet && <span className="error-text">{errors.ma_pallet}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Tên sản phẩm *</label>
            <select
              name="san_pham"
              className={`form-input ${errors.ten_san_pham ? "error" : ""}`}
              value={formData.san_pham}
              onChange={handleChange}
            >
              <option value="">-- Chọn sản phẩm --</option>
              {dropdownData.ds_san_pham.map((sp) => (
                <option key={sp.id} value={sp.id}>{sp.label}</option>
              ))}
            </select>
            {errors.ten_san_pham && <span className="error-text">{errors.ten_san_pham}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Số lượng ban đầu *</label>
            <input
              type="number"
              name="so_thung_ban_dau"
              className={`form-input ${errors.so_thung_ban_dau ? "error" : ""}`}
              value={formData.so_thung_ban_dau}
              onChange={handleChange}
              placeholder="Nhập số lượng ban đầu"
            />
            {errors.so_thung_ban_dau && <span className="error-text">{errors.so_thung_ban_dau}</span>}
          </div>

            <div className="form-group">
            <label className="form-label">Số lượng còn lại *</label>
            <input
              type="number"
              name="so_thung_con_lai"
              className={`form-input ${errors.so_thung_con_lai ? "error" : ""}`}
              value={formData.so_thung_con_lai}
              onChange={handleChange}
              placeholder="Nhập số lượng còn lại"
            />
            {errors.so_thung_con_lai && <span className="error-text">{errors.so_thung_con_lai}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái *</label>
            <select
              name="trang_thai"
              className={`form-input ${errors.trang_thai ? "error" : ""}`}
              value={formData.trang_thai}
              onChange={handleChange}
            >
              <option value="">-- Chọn trạng thái --</option>
              <option value="Mới">Mới</option>
              <option value="Đã_mở">Đã mở</option>
              <option value="Trống">Trống</option>
            </select>
            {errors.trang_thai && <span className="error-text">{errors.trang_thai}</span>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">
          <Calendar size={16} />
          Thông tin thời gian
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ngày sản xuất *</label>
            <input
              type="date"
              name="ngay_san_xuat"
              className={`form-input ${errors.ngay_san_xuat ? "error" : ""}`}
              value={formData.ngay_san_xuat}
              onChange={handleChange}
            />
            {errors.ngay_san_xuat && <span className="error-text">{errors.ngay_san_xuat}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Hạn sử dụng *</label>
            <input
              type="date"
              name="han_su_dung"
              className={`form-input ${errors.han_su_dung ? "error" : ""}`}
              value={formData.han_su_dung}
              onChange={handleChange}
            />
            {errors.han_su_dung && <span className="error-text">{errors.han_su_dung}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Ngày kiểm tra chất lượng</label>
            <input
              type="date"
              name="ngay_kiem_tra_cl"
              className="form-input"
              value={formData.ngay_kiem_tra_cl}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">
          <MapPin size={16} />
          Vị trí & Nhà cung cấp
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Vị trí để pallet *</label>
            <select
              name="vi_tri_kho"
              className={`form-input ${errors.vi_tri_kho ? "error" : ""}`}
              value={formData.vi_tri_kho}
              onChange={handleChange}
            >
              <option value="">-- Chọn vị trí --</option>
              {dropdownData.ds_vi_tri_kho.map((vt) => (
                <option key={vt.id} value={vt.id}>{vt.label}</option>
              ))}
            </select>
            {errors.vi_tri_kho && <span className="error-text">{errors.vi_tri_kho}</span>}
          </div>
          
          <div className="form-group">
            <label className="form-label">Nhà cung cấp *</label>
            <select
              name="nha_cung_cap"
              className={`form-input ${errors.nha_cung_cap ? "error" : ""}`}
              value={formData.nha_cung_cap}
              onChange={handleChange}
              >
              <option value="">-- Chọn nhà cung cấp --</option>
              {dropdownData.ds_nha_cung_cap.map((ncc) => (
                <option key={ncc.id} value={ncc.id}>{ncc.label}</option>
              ))}
            </select>
            {errors.nha_cung_cap && <span className="error-text">{errors.nha_cung_cap}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú</label>
          <textarea
            className="form-input"
            name="ghi_chu"
            rows="3"
            value={formData.ghi_chu}
            onChange={handleChange}
            placeholder="Nhập ghi chú về chất lượng, tình trạng sản phẩm..."
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          Sửa
        </button>
      </div>
    </form>
  )
}

export default SuaPallet
