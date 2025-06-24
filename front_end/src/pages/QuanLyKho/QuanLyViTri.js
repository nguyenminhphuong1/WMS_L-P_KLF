"use client";

import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";
import { Plus, ArrowLeft, Search, AlertTriangle } from "lucide-react";
import Modal from "../../components/common/Modal";
import { Link } from "react-router-dom";

const DEFAULT_FORM_VI_TRI = {
  ma_vi_tri: "",
  khu_vuc: "",
  hang: "",
  cot: "",
  loai_vi_tri: "Pallet",
  tai_trong_max: "",
  chieu_cao_max: "",
  trang_thai: "Trống",
  uu_tien_fifo: false,
  gan_cua_ra: false,
  vi_tri_cach_ly: false,
  ghi_chu: "",
};

const QuanLyViTri = () => {
  const { areaId } = useParams();
  const [area, setArea] = useState(null);

  // State quản lý vị trí
  const [positionsByArea, setPositionsByArea] = useState({}); // { [areaId]: [positions] }
  const [formPosition, setFormPosition] = useState(DEFAULT_FORM_VI_TRI);
  const [showPositionModal, setShowPositionModal] = useState(false);
  const [showAdvancedAddModal, setShowAdvancedAddModal] = useState(false);

  // State filter/search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Lấy thông tin khu vực
  useEffect(() => {
    axios
      .get(`http://localhost:8000/quanlykho/khuvuc/${areaId}/`)
      .then((res) => setArea(res.data))
      .catch(() => toast.error("Không thể tải thông tin khu vực!"));
  }, [areaId]);

  // Fetch vị trí cho từng khu vực khi danh sách khu vực thay đổi
  useEffect(() => {
    fetchPositionsByAreaId();
  }, [areaId]);

  // API: Lấy danh sách vị trí theo khu vực
  const fetchPositionsByAreaId = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/quanlykho/vitrikho/?khu_vuc=${areaId}`
      );
      setPositionsByArea((prev) => ({ ...prev, [areaId]: res.data }));
    } catch (err) {
      toast.error("Không thể tải danh sách vị trí!");
    }
  };

  // Xử lý filter/search khu vực
  const positions = positionsByArea[areaId] || [];
  const filteredPositions = positions.filter((position) => {
    const matchesSearch = position.ma_vi_tri
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = !filterStatus || position.trang_thai === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleDeletePosition = async (position) => {
    if (!window.confirm("Bạn có chắc muốn xóa vị trí này?")) return;
    try {
      await axios.delete(
        `http://localhost:8000/quanlykho/vitrikho/${position.id}/`
      );
      toast.success("Xóa vị trí thành công!");
      setShowPositionModal(false);
      setFormPosition(DEFAULT_FORM_VI_TRI);
      fetchPositionsByAreaId(formPosition.khu_vuc);
    } catch (err) {
      toast.error("Không thể xóa vị trí!");
    }
  };


  // Xử lý submit form vị trí
  const handleSubmitPosition = async (e) => {
    e.preventDefault();
    try {
      const data = { ...formPosition, khu_vuc: area.id };
      if (formPosition.id) {
        await axios.put(
          `http://localhost:8000/quanlykho/vitrikho/${formPosition.id}/`,
          data
        );
        toast.success("Cập nhật vị trí thành công!");
      } else {
        await axios.post("http://localhost:8000/quanlykho/vitrikho/", data);
        toast.success("Thêm vị trí thành công!");
      }
      setShowPositionModal(false);
      setFormPosition(DEFAULT_FORM_VI_TRI);
      fetchPositionsByAreaId(formPosition.khu_vuc);
    } catch (err) {
      toast.error("Lỗi! Vị trí đã tồn tại!");
    }
  };

  // Xử lý submit form nâng cao
  const handleSubmitAdvancedPosition = async (e) => {
    e.preventDefault();
    // TODO: Validate và gọi API tạo nhiều vị trí
    setShowAdvancedAddModal(false);
  };

  // Helper: Màu trạng thái vị trí
  const getStatusColor = (status) => {
    switch (status) {
      case "Trống":
        return "#10b981";
      case "Có_hàng":
        return "#3b82f6";
      case "Bảo_trì":
        return "#f59e0b";
      case "Hỏng":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  // Helper: Text trạng thái vị trí
  const getStatusText = (status) => {
    switch (status) {
      case "Trống":
        return "Trống";
      case "Có_hàng":
        return "Có hàng";
      case "Bảo_trì":
        return "Bảo trì";
      case "Hỏng":
        return "Hỏng";
      default:
        return "Trống";
    }
  };

  if (!area) return <div>Đang tải khu vực...</div>;

  return (
    <div className="quan-ly-vi-tri">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <div className="header-info">
            <h1 className="page-title">
              <Link to="/quan-ly-kho/khu-vuc" className="back-button">
                <ArrowLeft size={20} />
              </Link>
              Khu vực: <span style={{color: "#3b82f6", marginLeft: 4, marginRight: 4, fontWeight: 600}}>
                {area.ma_khu_vuc}
              </span>
              - {area.ten_khu_vuc}
            </h1>
            <p className="page-subtitle">
              Quản lý vị trí
            </p>
          </div>
          <div className="header-actions">
            <span className="status-badge status-active">
              Hệ thống hoạt động
            </span>
          </div>
        </div>
      </div>
      <div className="page-header">
        <div className="header-actions">
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm vị trí..."
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
              <option value="Có_hàng">Có hàng</option>
              <option value="Bảo_trì">Bảo trì</option>
              <option value="Trống">Trống</option>
              <option value="Hỏng">Hỏng</option>
            </select>
          </div>
          <div className="action-buttons">
            <button
              className="btn btn-outline"
              onClick={handleSubmitAdvancedPosition}
            >
              <Plus size={20} /> Thêm vị trí nâng cao
            </button>
          </div>
        </div>
      </div>

      {/* Danh sách khu vực */}
      <div className="areas-container">
        {area && (
          <div key={area.id} className="area-card">
            {/* Hiển thị grid vị trí */}
            <div
              className="positions-grid"
              style={{
                gridTemplateColumns: `repeat(${area.kich_thuoc_cot}, 52px)`, // 52px là ví dụ, có thể tăng/giảm
                gridAutoRows: "auto",
              }}
            >
              {Array.from({ length: area.kich_thuoc_cot }, (_, colIdx) => (
                <div className="positions-row" key={colIdx}>
                  {Array.from({ length: area.kich_thuoc_hang }, (_, rowIdx) => {
                    // Tìm vị trí có hàng/cột tương ứng
                    const position = filteredPositions.find(
                      (p) =>
                        Number(p.hang) === rowIdx + 1 &&
                        Number(p.cot) === colIdx + 1
                    );
                    return (
                      <div
                        key={colIdx}
                        className="position-cell"
                        style={{
                          backgroundColor: position
                            ? getStatusColor(position.trang_thai)
                            : "#e5e7eb",
                          color: position ? "white" : "#6b7280",
                          border: "1px solid #ccc",
                          cursor: "pointer"
                        }}
                        title={
                          position
                            ? `${position.ma_vi_tri} - ${getStatusText(position.trang_thai)}`
                            : `Hàng ${rowIdx + 1}, Cột ${colIdx + 1}`
                        }
                        onClick={() => {
                          if (position) {
                            setFormPosition({ ...position });
                          } else {
                            setFormPosition({
                              ...DEFAULT_FORM_VI_TRI,
                              khu_vuc: area.id,
                              hang: rowIdx + 1,
                              cot: colIdx + 1,
                            });
                          }
                          setShowPositionModal(true);
                        }}
                      >
                        {position ? position.ma_vi_tri : "+"}
                        {position && position.trang_thai === "Hỏng" && (
                          <AlertTriangle
                            size={12}
                            className="position-warning"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Chú thích */}
            <div className="area-legend">
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#10b981" }}
                ></div>
                <span>Trống</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#3b82f6" }}
                ></div>
                <span>Có hàng</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#f59e0b" }}
                ></div>
                <span>Bảo trì</span>
              </div>
              <div className="legend-item">
                <div
                  className="legend-color"
                  style={{ backgroundColor: "#ef4444" }}
                ></div>
                <span>Hỏng</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Thêm Vị Trí */}
      <Modal
        isOpen={showPositionModal}
        onClose={() => setShowPositionModal(false)}
        title={formPosition.id ? "Sửa vị trí" : "Thêm vị trí mới"}
      >
        <form className="position-form" onSubmit={handleSubmitPosition}>
          <div>
            Khu vực: {area.ma_khu_vuc} - {area.ten_khu_vuc}
          </div>
          <div className="form-group">
            <label>Mã vị trí</label>
            <input
              type="text"
              value={formPosition.ma_vi_tri}
              onChange={(e) =>
                setFormPosition({ ...formPosition, ma_vi_tri: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Hàng</label>
            <input
              type="number"
              value={formPosition.hang}
              onChange={(e) =>
                setFormPosition({ ...formPosition, hang: e.target.value })
              }
              required
            />
          </div>
          <div className="form-group">
            <label>Cột</label>
            <input
              type="number"
              value={formPosition.cot}
              onChange={(e) =>
                setFormPosition({ ...formPosition, cot: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Tải trọng max</label>
            <input
              type="number"
              value={formPosition.tai_trong_max}
              onChange={(e) =>
                setFormPosition({
                  ...formPosition,
                  tai_trong_max: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Chiều cao max</label>
            <input
              type="number"
              value={formPosition.chieu_cao_max}
              onChange={(e) =>
                setFormPosition({
                  ...formPosition,
                  chieu_cao_max: e.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Loại vị trí *</label>
            <select
              value={formPosition.loai_vi_tri}
              onChange={(e) =>
                setFormPosition({
                  ...formPosition,
                  loai_vi_tri: e.target.value,
                })
              }
              required
            >
              <option value="Pallet">Pallet</option>
              <option value="Carton">Carton</option>
              <option value="Bulk">Bulk</option>
            </select>
          </div>

          <div className="form-group">
            <label>Ưu tiên fifo</label>
            <input
              type="checkbox"
              value={formPosition.uu_tien_fifo}
              onChange={(e) =>
                setFormPosition({
                  ...formPosition,
                  uu_tien_fifo: e.target.checked,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Gần cửa ra</label>
            <input
              type="checkbox"
              value={formPosition.gan_cua_ra}
              onChange={(e) =>
                setFormPosition({
                  ...formPosition,
                  gan_cua_ra: e.target.checked,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Vị trí cách ly</label>
            <input
              type="checkbox"
              value={formPosition.vi_tri_cach_ly}
              onChange={(e) =>
                setFormPosition({
                  ...formPosition,
                  vi_tri_cach_ly: e.target.checked,
                })
              }
            />
          </div>

          <div className="form-group">
            <label>Trạng thái ban đầu</label>
            <select
              value={formPosition.trang_thai}
              onChange={(e) =>
                setFormPosition({ ...formPosition, trang_thai: e.target.value })
              }
            >
              <option value="Trống">Trống</option>
              <option value="Có_hàng">Có hàng</option>
              <option value="Bảo_trì">Bảo trì</option>
              <option value="Hỏng">Hỏng</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowPositionModal(false)}
            >
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {formPosition.id ? "Sửa" : "Thêm vị trí"}
            </button>

            {formPosition.id && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleDeletePosition(formPosition)}
              >
                Xóa
              </button>
            )}
          </div>
        </form>
      </Modal>

      {/* Modal Thêm Vị Trí Nâng Cao */}
      <Modal
        isOpen={showAdvancedAddModal}
        onClose={() => setShowAdvancedAddModal(false)}
        title="Thêm vị trí kho mới"
        size="large"
      >
        <form
          className="advanced-position-form"
          onSubmit={handleSubmitAdvancedPosition}
        >
          {/* ...giữ nguyên UI nâng cao như cũ... */}
          {/* Bạn có thể truyền state và onChange tương tự như các form trên */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setShowAdvancedAddModal(false)}
            >
              ❌ Hủy
            </button>
            <button type="button" className="btn btn-secondary">
              🔄 Reset
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuanLyViTri;
