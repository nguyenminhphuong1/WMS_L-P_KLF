"use client"

import { Calendar, Package, User, AlertTriangle, CheckCircle } from "lucide-react"
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import Modal from "../../components/common/Modal"
import SuaPallet from "./SuaPallet"

const ChiTietPallet = ({ pallet, onClose, onUpdate }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const [localPallet, setLocalPallet] = useState(pallet); // 👈 pallet hiện tại
  useEffect(() => {
    setLocalPallet(pallet); 
  }, [pallet]);

  const handleUpdatePallet = (updatedPallet) => {
      const newPallet = {
        ...updatedPallet,
        status: "active",
        qualityStatus: "passed",
      }

      setShowUpdateModal(false)
    }


  const handleEditClick = () => {     
    setShowUpdateModal(true);      
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getDaysUntilExpiry = () => {
    const today = new Date()
    const expiryDate = new Date(localPallet.han_su_dung)
    const diffTime = expiryDate - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getExpiryStatus = () => {
    const daysLeft = getDaysUntilExpiry()
    if (daysLeft < 0) return { status: "expired", text: "Đã hết hạn", class: "danger" }
    if (daysLeft <= 3) return { status: "critical", text: `Còn ${daysLeft} ngày`, class: "danger" }
    if (daysLeft <= 7) return { status: "warning", text: `Còn ${daysLeft} ngày`, class: "warning" }
    return { status: "good", text: `Còn ${daysLeft} ngày`, class: "success" }
  }

  const expiryStatus = getExpiryStatus()

  return (
    <div className="pallet-detail">
      {/* Header */}
      <div className="detail-header">
        <div className="pallet-info">
          <h3 className="pallet-code">{localPallet.ma_pallet}</h3>
          <div className="status-badges">
            <span className={`badge badge-${localPallet.status === "active" ? "success" : "warning"}`}>
              {localPallet.status === "active" ? "Hoạt động" : "Cảnh báo"}
            </span>
            <span className={`badge badge-${localPallet.qualityStatus === "passed" ? "success" : "warning"}`}>
              {localPallet.qualityStatus === "passed" ? "Chất lượng đạt" : "Cần kiểm tra"}
            </span>
          </div>
        </div>
        <div className="expiry-alert">
          <div className={`expiry-status ${expiryStatus.class}`}>
            {expiryStatus.status === "expired" ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
            <span>{expiryStatus.text}</span>
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="detail-section">
        <h4 className="section-title">
          <Package size={16} />
          Thông tin sản phẩm
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Mã sản phẩm:</label>
            <span className="product-code">{localPallet.ma_pallet}</span>
          </div>
          <div className="info-item">
            <label>Tên sản phẩm:</label>
            <span>{localPallet.ten_san_pham}</span>
          </div>
          <div className="info-item">
            <label>Số lượng ban đầu:</label>
            <span className="quantity">
              {localPallet.so_thung_ban_dau}
            </span>
          </div>
          <div className="info-item">
            <label>Số lượng còn lại:</label>
            <span className="quantity">
              {localPallet.so_thung_con_lai}
            </span>
          </div>
          <div className="info-item">
            <label>Vị trí:</label>
            <span className="location-badge">{localPallet.ma_vi_tri_kho}</span>
          </div>
        </div>
      </div>

      {/* Date Information */}
      <div className="detail-section">
        <h4 className="section-title">
          <Calendar size={16} />
          Thông tin thời gian
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Ngày giờ nhập:</label>
            <span>{formatDateTime(localPallet.created_at)}</span>
          </div>
          <div className="info-item">
            <label>Ngày sản xuất:</label>
            <span>{formatDate(localPallet.ngay_san_xuat)}</span>
          </div>
          <div className="info-item">
            <label>Hạn sử dụng:</label>
            <span className={`expiry-date ${expiryStatus.class}`}>{formatDate(localPallet.han_su_dung)}</span>
          </div>
          <div className="info-item">
            <label>Ngày kiểm tra chất lượng:</label>
            <span>{formatDate(localPallet.ngay_kiem_tra_cl)}</span>
          </div>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="detail-section">
        <h4 className="section-title">
          <User size={16} />
          Thông tin nhà cung cấp
        </h4>
        <div className="info-grid">
          <div className="info-item">
            <label>Nhà cung cấp:</label>
            <span>{localPallet.ten_nha_cung_cap}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {pallet.notes && (
        <div className="detail-section">
          <h4 className="section-title">Ghi chú</h4>
          <div className="notes-content">{localPallet.ghi_chu}</div>
        </div>
      )}

      {/* Actions */}
      <div className="detail-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
        <button className="btn btn-primary" onClick={() => handleEditClick()}>Chỉnh sửa</button>
      </div>

      {/* MODAL SỬA */}
      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Chỉnh sửa thông tin Pallet"
      >
        <SuaPallet
          pallet={pallet}
          onSuccess={(updatedPallet) => {
            onUpdate();   
            setLocalPallet(updatedPallet);     
            setShowUpdateModal(false);
          }}
          onCancel={() => setShowUpdateModal(false)}
        />
      </Modal>
    </div>
  ) 
}

export default ChiTietPallet
