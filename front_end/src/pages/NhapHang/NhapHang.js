"use client";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Search,
  Filter,
  Package,
  QrCode,
  Eye,
  Edit,
  Trash2,
  PlusCircle,
} from "lucide-react";
import Modal from "../../components/common/Modal";
import ThemPallet from "./ThemPallet";
import SuaPallet from "./SuaPallet";
import ChiTietPallet from "./ChiTietPallet";
//import InQRPallet from "./InQRPallet"
import "./NhapHang.css";
import { ThemTinhTrangHang } from "./ThemSuaTinhTrangHang";

const NhapHang = () => {
  const [activeTab, setActiveTab] = useState("danh-sach");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPallet, setSelectedPallet] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddTinhTrangModal, setShowAddTinhTrangModal] = useState(false);
  const [selectedPalletForTinhTrang, setSelectedPalletForTinhTrang] =
    useState(null);
  const [tinhTrangHienTai, setTinhTrangHienTai] = useState(null);

  const [pallets, setPallets] = useState([]);

  const fetchPallets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/nhaphang/pallets"
      );
      setPallets(response.data);
      setError(null);
    } catch (error) {
      toast.error("Lỗi khi lấy dữ liệu pallet:", error);
      setError("Không thể tải dữ liệu pallet. Vui lòng thử lại.");
      setPallets([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTinhTrangClick = async (pallet) => {
    setSelectedPalletForTinhTrang(pallet);
    setTinhTrangHienTai(null); // reset trước
    try {
      const res = await axios.get(
        `http://localhost:8000/quanlykho/tinhtranghang/?pallet=${pallet.id}`
      );
      // Giả sử API trả về mảng, lấy phần tử đầu tiên (hoặc sửa lại nếu trả về object)
      if (res.data && res.data.length > 0) {
        setTinhTrangHienTai(res.data[0]);
      } else {
        setTinhTrangHienTai(null);
      }
      setShowAddTinhTrangModal(true);
    } catch (err) {
      toast.error("Không lấy được tình trạng hàng!");
      setShowAddTinhTrangModal(true); // vẫn cho thêm mới nếu lỗi
    }
  };

  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    fetchPallets();
  }, []);

  const getRemainPercent = (so_luong_con_lai, so_thung_ban_dau) => {
    if (!so_thung_ban_dau || so_thung_ban_dau === 0) return 0;
    return Math.round((so_luong_con_lai / so_thung_ban_dau) * 100);
  };

  // Tạo mã pallet tự động
  const generatePalletCode = () => {
    const year = new Date().getFullYear();
    const existingCodes = pallets
      .filter((p) => p.ma_pallet.startsWith(`P-${year}-`))
      .map((p) => Number.parseInt(p.ma_pallet.split("-")[2]));

    const nextNumber =
      existingCodes.length > 0 ? Math.max(...existingCodes) + 1 : 1;
    return `P-${year}-${nextNumber.toString().padStart(3, "0")}`;
  };

  const handleAddPallet = (palletData) => {
    const newPallet = {
      ...palletData,
      status: "active",
      qualityStatus: "passed",
    };
    setPallets((prev) => [...prev, newPallet]);
    setShowAddModal(false);
  };

  const handleViewDetail = (pallet) => {
    setSelectedPallet(pallet);
    setShowDetailModal(true);
  };

  const handleUpdatePallet = (updatedPallet) => {
    const newPallet = {
      ...updatedPallet,
      status: "active",
      qualityStatus: "passed",
    };

    setPallets((prev) =>
      prev.map((p) => (p.id === newPallet.id ? newPallet : p))
    );

    setShowUpdateModal(false);
  };

  const handleEditClick = (pallet) => {
    setSelectedPallet(pallet);
    setShowUpdateModal(true);
  };

  const handlePrintQR = (pallet) => {
    setSelectedPallet(pallet);
    setShowQRModal(true);
  };

  const handleDeletePallet = async (palletId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa pallet này?")) {
      try {
        await axios.delete(
          `http://localhost:8000/nhaphang/pallets/${palletId}/`
        );
        setPallets(pallets.filter((p) => p.id !== palletId)); // Cập nhật giao diện
        toast.success("Đã xóa pallet thành công.");
      } catch (error) {
        console.error("Lỗi khi xóa pallet:", error);
        toast.error("Xóa pallet thất bại.");
      }
    }
  };

  const filteredPallets = pallets.filter(
    (pallet) =>
      pallet.ma_pallet.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.ten_san_pham.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.ma_vi_tri_kho.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pallet.ten_nha_cung_cap.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedPallets = searchTerm.trim() === "" ? pallets : filteredPallets;

  const getStatusBadge = (status) => {
    const statusConfig = {
      Mới: { label: "Mới", class: "badge-success" },
      Đã_mở: { label: "Đã mở", class: "badge-warning" },
      Trống: { label: "Trống", class: "badge-danger" },
    };
    const config = statusConfig[status] || statusConfig.active;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  const getQualityBadge = (qualityStatus) => {
    const qualityConfig = {
      passed: { label: "Đạt", class: "badge-success" },
      warning: { label: "Cảnh báo", class: "badge-warning" },
      failed: { label: "Không đạt", class: "badge-danger" },
    };
    const config = qualityConfig[qualityStatus] || qualityConfig.passed;
    return <span className={`badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="nhap-hang">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Quản lý nhập hàng</h1>
          <p className="page-subtitle">
            Theo dõi và quản lý pallet hoa quả từ nhà cung cấp
          </p>
        </div>
        <div className="header-actions">
          <button
            className="btn btn-primary"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={16} />
            Tạo Pallet mới
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="tabs-nav">
        <button
          className={`tab-btn ${activeTab === "danh-sach" ? "active" : ""}`}
          onClick={() => setActiveTab("danh-sach")}
        >
          <Package size={16} />
          Danh sách Pallet
        </button>
        <button
          className={`tab-btn ${activeTab === "thong-ke" ? "active" : ""}`}
          onClick={() => setActiveTab("thong-ke")}
        >
          <QrCode size={16} />
          Thống kê & QR
        </button>
      </div>

      {/* Search and Filter */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã pallet, sản phẩm, nhà cung cấp..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-secondary">
          <Filter size={16} />
          Bộ lọc
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "danh-sach" && (
        <div className="pallet-table card">
          <div className="card-header">
            <h3 className="card-title">
              Danh sách Pallet ({displayedPallets.length})
            </h3>
            <p className="card-subtitle">
              Quản lý thông tin chi tiết các pallet hoa quả
            </p>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Mã Pallet</th>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Vị trí</th>
                    <th className="date-col">Hạn sử dụng</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedPallets.map((pallet) => (
                    <tr key={pallet.id}>
                      <td>
                        <span className="pallet-code">{pallet.ma_pallet}</span>
                      </td>
                      <td>
                        <div className="product-info">
                          <span className="product-name">
                            {pallet.ten_san_pham}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="progress-bar-container">
                            <div
                              className="progress-bar-fill"
                              style={{
                                width: `${getRemainPercent(
                                  pallet.so_thung_con_lai,
                                  pallet.so_thung_ban_dau
                                )}%`,
                              }}
                            ></div>
                          </div>
                          <div className="progress-bar-label">
                            {pallet.so_thung_con_lai}/{pallet.so_thung_ban_dau}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="location-badge">
                          {pallet.ma_vi_tri_kho}
                        </span>
                      </td>
                      <td className="date-cell date-col">
                        {new Date(pallet.han_su_dung).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td>{getStatusBadge(pallet.trang_thai)}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn-action view"
                            onClick={() => handleViewDetail(pallet)}
                            title="Xem chi tiết"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            className="btn-action status"
                            onClick={() => handleTinhTrangClick(pallet)}
                            title="Tình trạng hàng"
                          >
                            <PlusCircle size={16} />
                          </button>
                          <button
                            className="btn-action edit"
                            title="Chỉnh sửa"
                            onClick={() => handleEditClick(pallet)}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDeletePallet(pallet.id)}
                            title="Xóa"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Tạo Pallet mới"
      >
        <ThemPallet
          onSuccess={(newPallet) => {
            handleAddPallet(newPallet);
            setShowAddModal(false);
          }}
          onCancel={() => setShowAddModal(false)}
          nextPalletCode={generatePalletCode()}
        />
      </Modal>

      <Modal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        title="Chỉnh sửa thông tin Pallet"
      >
        <SuaPallet
          pallet={selectedPallet}
          onSuccess={(updatedPallet) => {
            handleUpdatePallet(updatedPallet);
            setShowUpdateModal(false);
          }}
          onCancel={() => setShowUpdateModal(false)}
          nextPalletCode={generatePalletCode()}
        />
      </Modal>

      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Chi tiết Pallet"
      >
        {selectedPallet && (
          <ChiTietPallet
            pallet={selectedPallet}
            onUpdate={fetchPallets}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={showAddTinhTrangModal}
        onClose={() => setShowAddTinhTrangModal(false)}
        title={
          tinhTrangHienTai
            ? "Sửa tình trạng hàng"
            : "Thêm tình trạng hàng cho Pallet"
        }
      >
        {selectedPalletForTinhTrang && (
          <ThemTinhTrangHang
            palletId={selectedPalletForTinhTrang.id}
            tinhTrangHienTai={tinhTrangHienTai}
            onSuccess={() => {
              setShowAddTinhTrangModal(false);
              setSelectedPalletForTinhTrang(null);
              setTinhTrangHienTai(null);
              fetchPallets();
            }}
            onCancel={() => {
              setShowAddTinhTrangModal(false);
              setTinhTrangHienTai(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default NhapHang;
