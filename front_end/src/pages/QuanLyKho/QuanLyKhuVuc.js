"use client";

import { useNavigate } from "react-router-dom";
import { Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Modal from "../../components/common/Modal";
import { Search, Plus } from "lucide-react";

const DEFAULT_FORM_KHU_VUC = {
  ma_khu_vuc: "",
  ten_khu_vuc: "",
  mo_ta: "",
  kich_thuoc_hang: "",
  kich_thuoc_cot: "",
  tai_trong_max: "",
  nhiet_do_min: "",
  nhiet_do_max: "",
  do_am_min: "",
  do_am_max: "",
  trang_thai: "Hoạt_động",
};

const QuanLyKhuVuc = () => {
  const navigate = useNavigate();

  // State quản lý khu vực
  const [areas, setAreas] = useState([]);
  const [selectedArea, setSelectedArea] = useState(null);
  const [formArea, setFormArea] = useState(DEFAULT_FORM_KHU_VUC);
  const [showAreaModal, setShowAreaModal] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Fetch danh sách khu vực khi mount
  useEffect(() => {
    fetchAreas();
  }, []);

  // API: Lấy danh sách khu vực
  const fetchAreas = async () => {
    try {
      const res = await axios.get("http://localhost:8000/quanlykho/khuvuc/");
      setAreas(res.data);
    } catch (err) {
      toast.error("Không thể tải danh sách khu vực!");
    }
  };

  // Xử lý filter/search khu vực
  const filteredAreas = areas.filter((area) => {
    const matchesSearch =
      area.ten_khu_vuc?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.ma_khu_vuc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || area.trang_thai === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Xử lý mở modal thêm/sửa khu vực
  const handleOpenAreaModal = (area = null) => {
    setSelectedArea(area);
    setFormArea(area ? { ...area } : DEFAULT_FORM_KHU_VUC);
    setShowAreaModal(true);
  };

  // Xử lý submit form khu vực
  const handleSubmitArea = async (e) => {
    e.preventDefault();
    try {
      if (selectedArea) {
        await axios.put(
          `http://localhost:8000/quanlykho/khuvuc/${selectedArea.id}/`,
          formArea
        );
        toast.success("Cập nhật khu vực thành công!");
      } else {
        await axios.post("http://localhost:8000/quanlykho/khuvuc/", formArea);
        toast.success("Thêm khu vực thành công!");
      }
      setShowAreaModal(false);
      setSelectedArea(null);
      setFormArea(DEFAULT_FORM_KHU_VUC);
      fetchAreas();
    } catch (err) {
      toast.error("Có lỗi khi lưu khu vực!");
    }
  };

  const handleDeleteArea = async (area) => {
    if (!window.confirm("Bạn có chắc muốn xóa khu vực này?")) return;
    try {
      await axios.delete(`http://localhost:8000/quanlykho/khuvuc/${area.id}/`);
      toast.success("Xóa khu vực thành công!");
      fetchAreas(); // hoặc reload lại danh sách khu vực
    } catch (err) {
      toast.error("Lỗi! Khu vực đang chứa vị trí có hàng");
    }
  };

  // Helper: Màu trạng thái khu vực
  const getAreaStatusColor = (status) => {
    switch (status) {
      case "Hoạt_động":
        return "#10b981";
      case "Bảo_trì":
        return "#f59e0b";
      case "Ngừng":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  // Helper: Text trạng thái khu vực
  const getAreaStatusText = (status) => {
    switch (status) {
      case "Hoạt_động":
        return "Hoạt động";
      case "Bảo_trì":
        return "Bảo trì";
      case "Ngừng":
        return "Ngừng hoạt động";
      default:
        return "Hoạt động";
    }
  };

  return (
    <div className="quan-ly-vi-tri">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Header */}
      <div className="page-header">
        <div className="header-actions">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm khu vực..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="filter-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="Hoạt_động">Hoạt động</option>
              <option value="Bảo_trì">Bảo trì</option>
              <option value="Ngừng">Ngừng</option>
            </select>
          </div>
          <div className="action-buttons">
            <button
              className="btn btn-primary"
              onClick={() => handleOpenAreaModal()}
            >
              <Plus size={20} /> Thêm khu vực
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách khu vực dạng grid */}
      <div
        className="areas-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px",
          marginTop: "24px",
        }}
      >
        {filteredAreas.map((area) => (
          <div
            key={area.id}
            className={`area-card${area.trang_thai === "Bảo_trì" || area.trang_thai === "Ngừng" ? " area-card--locked" : ""}`}
            onClick={() => {
              if (area.trang_thai === "Bảo_trì" || area.trang_thai === "Ngừng")
                return;
              navigate(`/quan-ly-kho/vi-tri/${area.id}`);
            }}
            title={
              area.trang_thai === "Bảo_trì"
                ? "Khu vực đang bảo trì, không thể thao tác"
                : area.trang_thai === "Ngừng"
                ? "Khu vực đã ngừng hoạt động, không thể thao tác"
                : ""
            }
          >
            <div>
              <h3 style={{ margin: 0 }}>{area.ma_khu_vuc}</h3>
              <div style={{ fontWeight: "bold" }}>{area.ten_khu_vuc}</div>
              <div style={{ fontSize: 13, color: "#666" }}>
                {area.kich_thuoc_cot} x {area.kich_thuoc_hang} vị trí
              </div>
            </div>
            <div
              style={{
                color: getAreaStatusColor(area.trang_thai),
                fontWeight: 500,
              }}
            >
              {getAreaStatusText(area.trang_thai)}
            </div>
            <div className="area-actions">
              <button
                className="btn-action edit"
                title="Chỉnh sửa"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpenAreaModal(area);
                }}
              >
                <Edit size={14} />
              </button>
              <button
                className="btn-action delete"
                title="Xóa"
                onClick={(e) => {
                  e.stopPropagation(); // tránh click vào card
                  handleDeleteArea(area);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Thêm/Sửa Khu Vực */}
      <Modal
        isOpen={showAreaModal}
        onClose={() => setShowAreaModal(false)}
        title={selectedArea ? "Sửa khu vực" : "Thêm khu vực mới"}
      >
        <form className="area-form" onSubmit={handleSubmitArea}>
          <div className="form-group">
            <label>Mã khu vực *</label>
            <input
              type="text"
              value={formArea.ma_khu_vuc}
              onChange={(e) =>
                setFormArea({ ...formArea, ma_khu_vuc: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Tên khu vực *</label>
            <input
              type="text"
              value={formArea.ten_khu_vuc}
              onChange={(e) =>
                setFormArea({ ...formArea, ten_khu_vuc: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <input
              type="text"
              value={formArea.mo_ta}
              onChange={(e) =>
                setFormArea({ ...formArea, mo_ta: e.target.value })
              }
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Kích thước hàng *</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formArea.kich_thuoc_hang}
                onChange={(e) =>
                  setFormArea({ ...formArea, kich_thuoc_hang: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Kích thước cột *</label>
              <input
                type="number"
                min="1"
                max="20"
                value={formArea.kich_thuoc_cot}
                onChange={(e) =>
                  setFormArea({ ...formArea, kich_thuoc_cot: e.target.value })
                }
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Tải trọng max</label>
            <input
              type="text"
              value={formArea.tai_trong_max}
              onChange={(e) =>
                setFormArea({ ...formArea, tai_trong_max: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Nhiệt độ min</label>
            <input
              type="text"
              value={formArea.nhiet_do_min}
              onChange={(e) =>
                setFormArea({ ...formArea, nhiet_do_min: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Nhiệt độ max</label>
            <input
              type="text"
              value={formArea.nhiet_do_max}
              onChange={(e) =>
                setFormArea({ ...formArea, nhiet_do_max: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Độ ẩm min</label>
            <input
              type="text"
              value={formArea.do_am_min}
              onChange={(e) =>
                setFormArea({ ...formArea, do_am_min: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Độ ẩm max</label>
            <input
              type="text"
              value={formArea.do_am_max}
              onChange={(e) =>
                setFormArea({ ...formArea, do_am_max: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              value={formArea.trang_thai}
              onChange={(e) =>
                setFormArea({ ...formArea, trang_thai: e.target.value })
              }
            >
              <option value="Hoạt_động">Hoạt động</option>
              <option value="Bảo_trì">Bảo trì</option>
              <option value="Ngừng">Không hoạt động</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowAreaModal(false)}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedArea ? "Cập nhật" : "Thêm mới"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuanLyKhuVuc;
