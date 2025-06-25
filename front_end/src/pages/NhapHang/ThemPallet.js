"use client"

import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Calendar, MapPin, Package } from "lucide-react"
import ChiTietPallet from "./ChiTietPallet";

const ThemPallet = ({ onSubmit, onCancel, nextPalletCode, onSuccess }) => {
  const [warehouse, setWarehouse] = useState({
      ma_pallet: '',
      san_pham: '',
      nha_cung_cap: '',
      so_thung_ban_dau: 0,
      so_thung_con_lai: 0,
      vi_tri_kho: '',
      ngay_san_xuat: '',
      han_su_dung: '',
      ngay_kiem_tra_cl: '',
      trang_thai: 'Mới',
      ghi_chu: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWarehouse((prev) => ({ ...prev, [name]: value }));
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

    if (!warehouse.ma_pallet) newErrors.productCode = "Vui lòng nhập mã pallet"
    if (!warehouse.san_pham) newErrors.productName = "Vui lòng nhập tên sản phẩm"
    if (!warehouse.so_thung_ban_dau || warehouse.so_thung_ban_dau <= 0) newErrors.quantity = "Số lượng phải lớn hơn 0"
    if (!warehouse.ngay_san_xuat) newErrors.productionDate = "Vui lòng nhập ngày sản xuất"
    if (!warehouse.han_su_dung) newErrors.expiryDate = "Vui lòng nhập hạn sử dụng"
    if (!warehouse.vi_tri_kho) newErrors.location = "Vui lòng nhập vị trí"
    if (!warehouse.nha_cung_cap) newErrors.supplier = "Vui lòng nhập nhà cung cấp"

    // Kiểm tra logic ngày tháng
    if (warehouse.ngay_san_xuat && warehouse.han_su_dung) {
      if (new Date(warehouse.ngay_san_xuat) >= new Date(warehouse.han_su_dung)) {
        newErrors.expiryDate = "Hạn sử dụng phải sau ngày sản xuất"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
      e.preventDefault();
      if(!validateForm())
        return;
      const payload = {
          ma_pallet: warehouse.ma_pallet,
          san_pham: warehouse.san_pham,
          nha_cung_cap: warehouse.nha_cung_cap,
          so_thung_ban_dau: warehouse.so_thung_ban_dau,
          so_thung_con_lai: warehouse.so_thung_ban_dau,
          vi_tri_kho: warehouse.vi_tri_kho,
          ngay_san_xuat: warehouse.ngay_san_xuat,
          han_su_dung: warehouse.han_su_dung,
          ngay_kiem_tra_cl: warehouse.ngay_kiem_tra_cl,
          trang_thai: warehouse.trang_thai || 'Mới',
          ghi_chu: warehouse.ghi_chu || '',
      };
  
      try {
        const res = await axios.post('http://localhost:8000/nhaphang/pallets/', payload);
        alert('Tạo pallet thành công!');
        onSuccess(res.data)
      } catch (err) {
        alert('Tạo pallet thất bại!'+ (err.response?.data?.detail || err.message));
      }
    };

  // Tạo mã pallet tự động
  const generatePalletCode = (productCode, currentPosition) => {
    const today = new Date();
    const day = today.getDate();        
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();  

    return `${productCode}-${currentPosition}-${day}${month}${year%100}`;
  };

  useEffect(() => {
    if (warehouse.san_pham && warehouse.vi_tri_kho) {
      const selectedProduct = dropdownData.ds_san_pham.find(sp => String(sp.id) === String(warehouse.san_pham));
      const productCode = selectedProduct ? selectedProduct.code : '';
      const selectedPosition = dropdownData.ds_vi_tri_kho.find(vt => String(vt.id) === String(warehouse.vi_tri_kho));
      const positionCode = selectedPosition ? selectedPosition.label : '';
      const newCode = generatePalletCode(productCode, positionCode);
      setWarehouse(prev => ({ ...prev, ma_pallet: newCode }));
    }
  }, [warehouse.san_pham, warehouse.vi_tri_kho, dropdownData.ds_san_pham, dropdownData.ds_vi_tri_kho]);

  return (
    <form onSubmit={handleSubmit} className="pallet-form">
      <div className="form-section">
        <h4 className="section-title">
          <Package size={16} />
          Thông tin cơ bản
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mã Pallet (Tự động) *</label>
            <input
              type="text"
              name="ma_pallet"
              className={`form-input ${errors.ma_pallet ? "error" : ""}`}
              value={warehouse.ma_pallet}
              readOnly
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
              value={warehouse.san_pham}
              onChange={handleChange}
            >
              <option value="">-- Chọn sản phẩm --</option>
              {dropdownData.ds_san_pham.map((sp) => (
                <option key={sp.id} value={sp.id}>{sp.label}</option>
              ))}
            </select>
            {errors.san_pham && <span className="error-text">{errors.san_pham}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Số lượng *</label>
            <input
              type="number"
              name="so_thung_ban_dau"
              className={`form-input ${errors.so_thung_ban_dau ? "error" : ""}`}
              value={warehouse.so_thung_ban_dau}
              onChange={handleChange}
              placeholder="Nhập số lượng"
            />
            {errors.so_thung_ban_dau && <span className="error-text">{errors.so_thung_ban_dau}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái *</label>
            <select
              name="trang_thai"
              className={`form-input ${errors.trang_thai ? "error" : ""}`}
              value={warehouse.trang_thai}
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
              value={warehouse.ngay_san_xuat}
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
              value={warehouse.han_su_dung}
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
              value={warehouse.ngay_kiem_tra_cl}
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
              value={warehouse.vi_tri_kho}
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
              value={warehouse.nha_cung_cap}
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
            value={warehouse.ghi_chu}
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
          Tạo Pallet
        </button>
      </div>
    </form>
  )
}

export default ThemPallet
