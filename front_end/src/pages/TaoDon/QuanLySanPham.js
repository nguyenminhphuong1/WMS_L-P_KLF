"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Package, Tag, Star, Image as ImageIcon } from "lucide-react"
import Modal from "../../components/common/Modal"

const DEFAULT_FORM = {
  ma_san_pham: "",
  ten_san_pham: "",
  nhom_hang: "",
  thuong_hieu: "",
  dung_tich: "",
  don_vi_tinh: "",
  so_luong_per_thung: "",
  ma_vach: "",
  nha_cung_cap: "",
  han_su_dung_mac_dinh: "",
  chu_ky_kiem_tra_cl: "",
  hinh_anh: "",
  mo_ta: "",
  trang_thai: "Hoạt_động",
  is_template: false,
}

const LOCAL_TEMPLATE_KEY = "wms_templates"

const QuanLySanPham = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [units] = useState(["kg", "gram", "thùng", "túi", "quả"])
  const [formData, setFormData] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState("")

  // --- Template localStorage ---
  const getTemplateIds = () => {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_TEMPLATE_KEY)) || []
    } catch {
      return []
    }
  }
  const setTemplateIds = (ids) => {
    localStorage.setItem(LOCAL_TEMPLATE_KEY, JSON.stringify(ids))
  }

  // Fetch dropdown nhóm hàng & nhà cung cấp
  useEffect(() => {
    axios
      .get("http://localhost:8000/quanlykho/sanpham/dropdown_them_sua")
      .then((res) => {
        const {
          nhom_hang_dropdown = [],
          nha_cung_cap_dropdown = []
        } = res.data || {};
        setCategories(nhom_hang_dropdown);
        setSuppliers(nha_cung_cap_dropdown);
      })
      .catch(() => {
        setCategories([]);
        setSuppliers([]);
      });
  }, []);

  // Fetch sản phẩm
  const fetchProducts = () => {
    axios
      .get("http://localhost:8000/quanlykho/sanpham/")
      .then((res) => {
        const data = res.data || []
        // Gắn is_template từ localStorage
        const templateIds = getTemplateIds()
        setProducts(
          data.map((p) => ({
            ...p,
            is_template: templateIds.includes(p.id)
          }))
        )
      })
      .catch(() => setProducts([]))
  }

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line
  }, [])

  // Lọc sản phẩm
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find(c => c.id === product.nhom_hang)?.ten_nhom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.thuong_hieu?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !selectedCategory || String(product.nhom_hang) === String(selectedCategory)
    return matchesSearch && matchesCategory
  })

  const templateProducts = products.filter((p) => p.is_template)

  // Validate form
  const validateForm = () => {
    const newErrors = {}
    if (!formData.ma_san_pham.trim()) newErrors.ma_san_pham = "Mã sản phẩm không được để trống"
    if (!formData.ten_san_pham.trim()) newErrors.ten_san_pham = "Tên sản phẩm không được để trống"
    if (!formData.nhom_hang) newErrors.nhom_hang = "Vui lòng chọn nhóm hàng"
    if (!formData.don_vi_tinh) newErrors.don_vi_tinh = "Vui lòng chọn đơn vị"
    if (!formData.nha_cung_cap) newErrors.nha_cung_cap = "Vui lòng chọn nhà cung cấp"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["nhom_hang", "nha_cung_cap"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? "" : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Thêm sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (
          ["nhom_hang", "nha_cung_cap", "so_luong_per_thung", "dung_tich", "han_su_dung_mac_dinh", "chu_ky_kiem_tra_cl"].includes(key)
        ) {
          form.append(key, value !== "" ? value : null)
        } else {
          form.append(key, value ?? "")
        }
      })
      const res = await axios.post("http://localhost:8000/quanlykho/sanpham/", form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      // Xử lý template local
      if (formData.is_template) {
        const templateIds = getTemplateIds()
        setTemplateIds([...new Set([...templateIds, res.data.id])])
      }
      alert("Thêm sản phẩm thành công!")
      setShowAddModal(false)
      resetForm()
      fetchProducts()
    } catch (err) {
      alert("Thêm sản phẩm thất bại! " + (err.response?.data?.detail || err.message))
    }
  }

  // Sửa sản phẩm
  const handleSubmitEdit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      const form = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (
          ["nhom_hang", "nha_cung_cap", "so_luong_per_thung", "dung_tich", "han_su_dung_mac_dinh", "chu_ky_kiem_tra_cl"].includes(key)
        ) {
          form.append(key, value === "" ? "null" : value)
        } else {
          form.append(key, value ?? "")
        }
      })
      await axios.put(`http://localhost:8000/quanlykho/sanpham/${selectedProduct.id}/`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      // Xử lý template local
      const templateIds = getTemplateIds()
      if (formData.is_template) {
        setTemplateIds([...new Set([...templateIds, selectedProduct.id])])
      } else {
        setTemplateIds(templateIds.filter((id) => id !== selectedProduct.id))
      }
      alert("Cập nhật sản phẩm thành công!")
      setShowEditModal(false)
      resetForm()
      fetchProducts()
    } catch (err) {
      alert("Cập nhật sản phẩm thất bại! " + (err.response?.data?.detail || err.message))
    }
  }

  // Xóa sản phẩm
  const handleDelete = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await axios.delete(`http://localhost:8000/quanlykho/sanpham/${productId}/`)
        // Xóa khỏi template local
        const templateIds = getTemplateIds()
        setTemplateIds(templateIds.filter((id) => id !== productId))
        fetchProducts()
      } catch (err) {
        alert("Xóa sản phẩm thất bại! " + (err.response?.data?.detail || err.message))
      }
    }
  }

  // Tạo từ template
  const createFromTemplate = (template) => {
    setFormData({
      ...DEFAULT_FORM,
      ma_san_pham: "",
      ten_san_pham: template.ten_san_pham,
      nhom_hang: template.nhom_hang,
      thuong_hieu: template.thuong_hieu,
      dung_tich: template.dung_tich,
      don_vi_tinh: template.don_vi_tinh,
      so_luong_per_thung: template.so_luong_per_thung,
      ma_vach: template.ma_vach,
      nha_cung_cap: template.nha_cung_cap,
      han_su_dung_mac_dinh: template.han_su_dung_mac_dinh,
      chu_ky_kiem_tra_cl: template.chu_ky_kiem_tra_cl,
      mo_ta: template.mo_ta,
      trang_thai: "Hoạt_động",
      is_template: false,
    })
    setImageFile(null)
    setImagePreview("")
    setShowTemplateModal(false)
    setShowAddModal(true)
  }

  // Reset form
  const resetForm = () => {
    setFormData(DEFAULT_FORM)
    setErrors({})
    setSelectedProduct(null)
    setImageFile(null)
    setImagePreview("")
  }

  // Sửa sản phẩm
  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      ma_san_pham: product.ma_san_pham,
      ten_san_pham: product.ten_san_pham,
      nhom_hang: product.nhom_hang,
      thuong_hieu: product.thuong_hieu,
      dung_tich: product.dung_tich,
      don_vi_tinh: product.don_vi_tinh,
      so_luong_per_thung: product.so_luong_per_thung,
      ma_vach: product.ma_vach,
      nha_cung_cap: product.nha_cung_cap,
      han_su_dung_mac_dinh: product.han_su_dung_mac_dinh,
      chu_ky_kiem_tra_cl: product.chu_ky_kiem_tra_cl,
      mo_ta: product.mo_ta,
      trang_thai: product.trang_thai,
      is_template: !!product.is_template,
    })
    setShowEditModal(true)
  }

  // Xử lý chọn ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    setImageFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result)
      reader.readAsDataURL(file)
    } else {
      setImagePreview("")
    }
  }

  // Modal template
  const TemplateModal = () => (
    <div className="template-modal">
      <h4>Chọn template sản phẩm</h4>
      <div className="template-grid">
        {templateProducts.map((template) => (
          <div key={template.id} className="template-card" onClick={() => createFromTemplate(template)}>
            <div className="template-header">
              <Package size={20} />
              <Star size={16} className="template-star" />
            </div>
            <div className="template-info">
              <div className="template-name">{template.ten_san_pham}</div>
              <div className="template-code">{template.ma_san_pham}</div>
              <div className="template-category">{categories.find(c => String(c.id) === String(template.nhom_hang))?.ten_nhom || ""}</div>
            </div>
          </div>
        ))}
      </div>
      {templateProducts.length === 0 && (
        <div className="no-templates">
          <p>Chưa có template nào. Hãy tạo sản phẩm và đánh dấu làm template.</p>
        </div>
      )}
    </div>
  )

  return (
    <div className="quan-ly-san-pham">
      <div className="section-header">
        <div>
          <h2 className="section-title">Quản lý Sản phẩm</h2>
          <p className="section-subtitle">Quản lý danh mục và thông tin sản phẩm</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => setShowTemplateModal(true)}>
            <Star size={16} />
            Template ({templateProducts.length})
          </button>
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowAddModal(true) }}>
            <Plus size={16} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã sản phẩm..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          <option value="">Tất cả nhóm hàng</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.ten_nhom}
            </option>
          ))}
        </select>
      </div>

      {/* Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{products.filter((p) => p.trang_thai === "Hoạt_động").length}</div>
            <div className="stat-label">Sản phẩm hoạt động</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Tag size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{categories.length}</div>
            <div className="stat-label">Nhóm hàng</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Star size={24} style={{ color: "#ffc107" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{templateProducts.length}</div>
            <div className="stat-label">Template thường dùng</div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="products-table card">
        <div className="card-header">
          <h3 className="card-title">Danh sách sản phẩm ({filteredProducts.length})</h3>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Ảnh</th>
                  <th>Mã SP</th>
                  <th>Tên sản phẩm</th>
                  <th>Nhóm hàng</th>
                  <th>Đơn vị</th>
                  <th>Template</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      {product.hinh_anh ? (
                        <img src={product.hinh_anh.startsWith("http") ? product.hinh_anh : `${process.env.REACT_APP_API_URL || "http://localhost:8000"}${product.hinh_anh}`} alt="sp" style={{ width: 40, height: 40, objectFit: "cover", borderRadius: 4 }} />
                      ) : (
                        <ImageIcon size={24} color="#ccc" />
                      )}
                    </td>
                    <td>
                      <span className="product-code">{product.ma_san_pham}</span>
                    </td>
                    <td>
                      <div className="product-info">
                        <span className="product-name">{product.ten_san_pham}</span>
                        {product.mo_ta && <span className="product-desc">{product.mo_ta}</span>}
                      </div>
                    </td>
                    <td>
                      {categories.find(c => String(c.id) === String(product.nhom_hang))?.ten_nhom || ""}
                    </td>
                    <td>
                      <span className="unit-badge">{product.don_vi_tinh}</span>
                    </td>
                    <td>
                      {product.is_template && (
                        <span className="template-badge">
                          <Star size={12} />
                          Template
                        </span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${product.trang_thai === "Hoạt_động" ? "badge-success" : "badge-secondary"}`}>
                        {product.trang_thai === "Hoạt_động" ? "Hoạt động" : "Ngừng"}
                      </span>
                    </td>
                    <td className="date-cell">
                      {product.created_at
                        ? new Date(product.created_at).toLocaleDateString("vi-VN")
                        : ""}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action edit" onClick={() => handleEdit(product)} title="Chỉnh sửa">
                          <Edit size={14} />
                        </button>
                        <button className="btn-action delete" onClick={() => handleDelete(product.id)} title="Xóa">
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
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Thêm sản phẩm mới">
        <ProductForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => setShowAddModal(false)}
          categories={categories}
          suppliers={suppliers}
          units={units}
          imageFile={imageFile}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          showEditModal={false}
        />
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Chỉnh sửa sản phẩm">
        <ProductForm
          formData={formData}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmitEdit}
          onCancel={() => setShowEditModal(false)}
          categories={categories}
          suppliers={suppliers}
          units={units}
          imageFile={imageFile}
          imagePreview={imagePreview}
          onImageChange={handleImageChange}
          showEditModal={true}
        />
      </Modal>

      <Modal isOpen={showTemplateModal} onClose={() => setShowTemplateModal(false)} title="Template sản phẩm">
        <TemplateModal />
      </Modal>
    </div>
  )
}

// --- ProductForm tách riêng ---
const ProductForm = ({
  formData,
  errors,
  onChange,
  onSubmit,
  onCancel,
  categories,
  suppliers,
  units,
  imageFile,
  imagePreview,
  onImageChange,
  showEditModal
}) => {
  if (!formData) return null;
  if (!errors || typeof errors !== "object") errors = {};

  return (
    <form onSubmit={onSubmit} className="product-form">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Nhóm hàng *</label>
          <select
            name="nhom_hang"
            className={`form-input ${errors.nhom_hang ? "error" : ""}`}
            value={formData.nhom_hang}
            onChange={onChange}
          >
            <option value="">Chọn nhóm hàng</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.ten_nhom}
              </option>
            ))}
          </select>
          {errors.nhom_hang && <span className="error-text">{errors.nhom_hang}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Mã sản phẩm *</label>
          <input
            name="ma_san_pham"
            type="text"
            className={`form-input ${errors.ma_san_pham ? "error" : ""}`}
            value={formData.ma_san_pham}
            onChange={onChange}
            placeholder="Nhập mã sản phẩm"
          />
          {errors.ma_san_pham && <span className="error-text">{errors.ma_san_pham}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Tên sản phẩm *</label>
          <input
            name="ten_san_pham"
            type="text"
            className={`form-input ${errors.ten_san_pham ? "error" : ""}`}
            value={formData.ten_san_pham}
            onChange={onChange}
            placeholder="Nhập tên sản phẩm"
          />
          {errors.ten_san_pham && <span className="error-text">{errors.ten_san_pham}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Thương hiệu</label>
          <input
            name="thuong_hieu"
            type="text"
            className="form-input"
            value={formData.thuong_hieu}
            onChange={onChange}
            placeholder="Nhập thương hiệu"
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Dung tích</label>
          <input
            name="dung_tich"
            type="number"
            className="form-input"
            value={formData.dung_tich}
            onChange={onChange}
            placeholder="Nhập dung tích"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Đơn vị *</label>
          <select
            name="don_vi_tinh"
            className={`form-input ${errors.don_vi_tinh ? "error" : ""}`}
            value={formData.don_vi_tinh}
            onChange={onChange}
          >
            <option value="">Chọn đơn vị</option>
            {units.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.don_vi_tinh && <span className="error-text">{errors.don_vi_tinh}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Số lượng/thùng</label>
          <input
            name="so_luong_per_thung"
            type="number"
            className="form-input"
            value={formData.so_luong_per_thung}
            onChange={onChange}
            placeholder="Số lượng mỗi thùng"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Nhà cung cấp *</label>
          <select
            name="nha_cung_cap"
            className={`form-input ${errors.nha_cung_cap ? "error" : ""}`}
            value={formData.nha_cung_cap}
            onChange={onChange}
          >
            <option value="">Chọn nhà cung cấp</option>
            {suppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.ten_nha_cung_cap}
              </option>
            ))}
          </select>
          {errors.nha_cung_cap && <span className="error-text">{errors.nha_cung_cap}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Mã vạch</label>
          <input
            name="ma_vach"
            type="text"
            className="form-input"
            value={formData.ma_vach}
            onChange={onChange}
            placeholder="Nhập mã vạch"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Chu kỳ kiểm tra CL</label>
          <input
            name="chu_ky_kiem_tra_cl"
            type="number"
            className="form-input"
            value={formData.chu_ky_kiem_tra_cl}
            onChange={onChange}
            placeholder="Chu kỳ kiểm tra chất lượng"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Hạn sử dụng (ngày)</label>
          <input
            name="han_su_dung_mac_dinh"
            type="number"
            className="form-input"
            value={formData.han_su_dung_mac_dinh}
            onChange={onChange}
            placeholder="Hạn sử dụng (ngày)"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Ảnh sản phẩm</label>
          <input
            type="file"
            accept="image/*"
            className="form-input"
            onChange={onImageChange}
          />
          {imagePreview && (
            <div style={{ marginTop: 8 }}>
              <img src={imagePreview} alt="preview" style={{ maxWidth: 80, maxHeight: 80, border: "1px solid #ccc" }} />
            </div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Mô tả</label>
        <textarea
          name="mo_ta"
          className="form-input"
          rows="3"
          value={formData.mo_ta}
          onChange={onChange}
          placeholder="Nhập mô tả sản phẩm"
        />
      </div>

      <div className="form-group">
        <label className="form-label">Trạng thái *</label>
        <select
          name="trang_thai"
          className="form-input"
          value={formData.trang_thai}
          onChange={onChange}
        >
          <option value="Hoạt_động">Hoạt động</option>
          <option value="Ngừng">Ngừng</option>
        </select>
        {errors.trang_thai && <span className="error-text">{errors.trang_thai}</span>}
      </div>

      <div className="form-group" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          id="is_template"
          name="is_template"
          type="checkbox"
          checked={formData.is_template}
          onChange={onChange}
          style={{ width: 18, height: 18, marginRight: 8 }}
        />
        <label htmlFor="is_template" style={{ margin: 0, cursor: "pointer" }}>
          Đặt làm template thường dùng
        </label>
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
          {showEditModal ? "Cập nhật" : "Thêm sản phẩm"}
        </button>
      </div>
    </form>
  );
};

export default QuanLySanPham