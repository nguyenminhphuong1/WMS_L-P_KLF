"use client"

import axios from 'axios';
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect, useRef } from "react"
import { Plus, Search, Edit, Trash2, MapPin, Phone, Store } from "lucide-react"
import Modal from "../../components/common/Modal"

const DEFAULT_FORM = {
  ma_cua_hang: "",
  ten_cua_hang: "",
  so_dien_thoai: "",
  dia_chi: "",
  trang_thai: "Hoạt_động",
  created_at: ""
};

const QuanLyCuaHang = ({ onSuccess }) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedArea, setSelectedArea] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState(null)
  const [errors, setErrors] = useState({})
  const [stores, setStores] = useState([]);
  const [areas, setAreas] = useState([]);
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [dropdownData, setDropdownData] = useState({ ds_vi_tri: [] });

  // Fetch stores
  const fetchCuaHang = async () => {
    try {
      const response = await axios.get('http://localhost:8000/taodon/cuahang/');
      setStores(response.data);
      setErrors({});
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu cửa hàng:", error);
      setErrors({ fetch: "Không thể tải dữ liệu cửa hàng. Vui lòng thử lại." });
      setStores([]);
    }
  };

  // Fetch areas
  useEffect(() => {
    axios.get("http://localhost:8000/taodon/chitietvitricuahang/khu_vuc_phu_song/")
      .then((response) => {
        setAreas(response.data.ds_khu_vuc || []);
      })
      .catch((error) => {
        console.error("Lỗi gọi API:", error);
      });
  }, []);

  // Fetch dropdown vị trí
  useEffect(() => {
    axios.get('http://localhost:8000/taodon/cuahang/danh_sach_chi_tiet_vi_tri/')
      .then((res) => {
        setDropdownData(res.data || { ds_vi_tri: [] });
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu dropdown:', err);
      });
  }, []);

  // Fetch stores on mount
  useEffect(() => {
    fetchCuaHang();
  }, []);

  // Filter stores
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      store.ten_cua_hang?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.dia_chi_chi_tiet?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.so_dien_thoai?.includes(searchTerm);
    const matchesArea = !selectedArea || String(store.dia_chi) === selectedArea;
    return matchesSearch && matchesArea;
  });

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.ten_cua_hang.trim()) newErrors.ten_cua_hang = "Tên cửa hàng không được để trống";
    if (!formData.dia_chi) newErrors.dia_chi = "Địa chỉ không được để trống";
    if (!formData.so_dien_thoai.trim()) newErrors.so_dien_thoai = "Số điện thoại không được để trống";
    const phoneRegex = /^[0-9]{10,11}$/;
    if (formData.so_dien_thoai && !phoneRegex.test(formData.so_dien_thoai.replace(/[-\s]/g, ""))) {
      newErrors.so_dien_thoai = "Số điện thoại không hợp lệ";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle add
  const handleAdd = () => {
    setFormData(DEFAULT_FORM);
    setErrors({});
    setShowAddModal(true);
  };

  // Handle submit add
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = {
      ma_cua_hang: formData.ma_cua_hang,
      ten_cua_hang: formData.ten_cua_hang,
      so_dien_thoai: formData.so_dien_thoai,
      dia_chi: formData.dia_chi,
      trang_thai: formData.trang_thai || "Hoạt_động",
    };
    try {
      const res = await axios.post('http://localhost:8000/taodon/cuahang/', payload);
      alert('Tạo cửa hàng thành công!');
      fetchCuaHang();
      setShowAddModal(false);
      setFormData(DEFAULT_FORM);
      setErrors({});
      if (onSuccess) onSuccess(res.data);
    } catch (err) {
      alert('Tạo cửa hàng thất bại! ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle edit
  const handleEdit = (store) => {
    setSelectedStore(store);
    setFormData({
      ma_cua_hang: store.ma_cua_hang || "",
      ten_cua_hang: store.ten_cua_hang || "",
      so_dien_thoai: store.so_dien_thoai || "",
      dia_chi: store.dia_chi || store.dia_chi_chi_tiet || "",
      trang_thai: store.trang_thai || "Hoạt_động",
      created_at: store.created_at || ""
    });
    setErrors({});
    setShowEditModal(true);
  };

  // Handle submit edit
  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const payload = {
      ma_cua_hang: formData.ma_cua_hang,
      ten_cua_hang: formData.ten_cua_hang,
      so_dien_thoai: formData.so_dien_thoai,
      dia_chi: formData.dia_chi,
      trang_thai: formData.trang_thai || "Hoạt_động",
    };
    try {
      await axios.put(`http://localhost:8000/taodon/cuahang/${selectedStore.id}/`, payload);
      alert('Cập nhật cửa hàng thành công!');
      fetchCuaHang();
      setShowEditModal(false);
      setFormData(DEFAULT_FORM);
      setErrors({});
    } catch (err) {
      alert('Cập nhật cửa hàng thất bại! ' + (err.response?.data?.detail || err.message));
    }
  };

  // Handle delete
  const handleDelete = async (storeId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cửa hàng này?")) {
      try {
        await axios.delete(`http://localhost:8000/taodon/cuahang/${storeId}/`);
        fetchCuaHang();
      } catch (err) {
        alert('Xóa cửa hàng thất bại! ' + (err.response?.data?.detail || err.message));
      }
    }
  };

  // Handle change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Badge
  const getStatusBadge = (status) => (
    <span className={`badge ${status === "Hoạt_động" ? "badge-success" : "badge-secondary"}`}>
      {status === "Hoạt_động" ? "Hoạt động" : "Tạm dừng"}
    </span>
  );

  return (
    <div className="quan-ly-cua-hang">
      <div className="section-header">
        <div>
          <h2 className="section-title">Quản lý Cửa hàng</h2>
          <p className="section-subtitle">Quản lý thông tin các cửa hàng và đối tác</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={16} />
          Thêm cửa hàng
        </button>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, địa chỉ, SĐT..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Tất cả khu vực</option>
          {areas.map((khuVuc) => (
            <option key={khuVuc.id} value={khuVuc.id}>
              {khuVuc.label}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Store size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stores.filter((s) => s.trang_thai === "Hoạt_động").length}</div>
            <div className="stat-label">Cửa hàng hoạt động</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <MapPin size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{areas.length}</div>
            <div className="stat-label">Khu vực phủ sóng</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Phone size={24} style={{ color: "#ffc107" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{stores.length}</div>
            <div className="stat-label">Tổng số cửa hàng</div>
          </div>
        </div>
      </div>

      {/* Stores Table */}
      <div className="stores-table card">
        <div className="card-header">
          <h3 className="card-title">Danh sách cửa hàng ({filteredStores.length})</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã cửa hàng</th>
                  <th>Tên cửa hàng</th>
                  <th>SĐT</th>
                  <th>Địa chỉ</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <div className="store-info">
                        <span className="store-name">{store.ma_cua_hang}</span>
                      </div>
                    </td>
                    <td className="address-cell">{store.ten_cua_hang}</td>
                    <td className="phone-cell">{store.so_dien_thoai}</td>
                    <td>
                      <span className="area-badge">{store.dia_chi_chi_tiet || store.dia_chi}</span>
                    </td>
                    <td>{getStatusBadge(store.trang_thai)}</td>
                    <td className="date-cell">{store.created_at ? new Date(store.created_at).toLocaleDateString("vi-VN") : ""}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action edit" onClick={() => handleEdit(store)} title="Chỉnh sửa">
                          <Edit size={14} />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete(store.id)} title="Xóa">
                          <Trash2 size={14} />
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

      {/* Modals */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Thêm cửa hàng mới">
        <StoreForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowAddModal(false)}
          dropdownData={dropdownData}
          showEditModal={false}
        />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Chỉnh sửa cửa hàng">
        <StoreForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmitEdit}
          onCancel={() => setShowEditModal(false)}
          dropdownData={dropdownData}
          showEditModal={true}
        />
      </Modal>
    </div>
  );
};

const StoreForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
  dropdownData,
  showEditModal
}) => {
  // Phòng ngừa lỗi nếu formData hoặc errors bị null
  if (!formData) return null;
  if (!errors || typeof errors !== "object") errors = {};

  return (
    <form onSubmit={onSubmit} className="store-form">
      <div className="form-group">
        <label className="form-label">Mã cửa hàng *</label>
        <input
          name="ma_cua_hang"
          type="text"
          className={`form-input ${errors.ma_cua_hang ? "error" : ""}`}
          value={formData.ma_cua_hang}
          onChange={onChange}
          placeholder="Nhập mã cửa hàng"
        />
        {errors.ma_cua_hang && <span className="error-text">{errors.ma_cua_hang}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Tên cửa hàng *</label>
          <input
            name="ten_cua_hang"
            type="text"
            className={`form-input ${errors.ten_cua_hang ? "error" : ""}`}
            value={formData.ten_cua_hang}
            onChange={onChange}
            placeholder="Nhập tên cửa hàng"
          />
          {errors.ten_cua_hang && <span className="error-text">{errors.ten_cua_hang}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Số điện thoại *</label>
          <input
            name="so_dien_thoai"
            className={`form-input ${errors.so_dien_thoai ? "error" : ""}`}
            value={formData.so_dien_thoai}
            onChange={onChange}
            placeholder="Nhập số điện thoại"
          />
          {errors.so_dien_thoai && <span className="error-text">{errors.so_dien_thoai}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Địa chỉ *</label>
        <select
          name="dia_chi"
          className={`form-input ${errors.dia_chi ? "error" : ""}`}
          value={formData.dia_chi}
          onChange={onChange}
        >
          <option value="">-- Chọn vị trí --</option>
          {dropdownData.ds_vi_tri.map((vt) => (
            <option key={vt.id} value={vt.id}>{vt.label}</option>
          ))}
        </select>
        {errors.dia_chi && <span className="error-text">{errors.dia_chi}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">Trạng thái</label>
        <select
          name="trang_thai"
          className="form-input"
          value={formData.trang_thai}
          onChange={onChange}
        >
          <option value="Hoạt_động">Hoạt động</option>
          <option value="Tạm_dừng">Tạm dừng</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Hủy
        </button>
        <button type="submit" className="btn btn-primary">
          {showEditModal ? "Cập nhật" : "Thêm cửa hàng"}
        </button>
      </div>
    </form>
  );
};

export default QuanLyCuaHang;