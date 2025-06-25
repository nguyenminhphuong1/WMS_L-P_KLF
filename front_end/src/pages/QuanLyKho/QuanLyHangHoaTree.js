"use client"

import axios from "axios"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect } from "react"
import { ChevronDown, ChevronRight, Plus, Search, Package, Wine, Box, Package2, Edit, Trash2, BarChart3 } from "lucide-react"
import Modal from "../../components/common/Modal"

const DEFAULT_SANPHAM = {
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
  mo_ta: "",
  trang_thai: "Hoạt_động",
}

const DEFAULT_NHOMHANG = {
  ma_nhom: "",
  ten_nhom: "",
  mo_ta: "",
  icon: "",
  mau_sac: "",
  yeu_cau_nhiet_do_min: "",
  yeu_cau_nhiet_do_max: "",
  yeu_cau_do_am_min: "",
  yeu_cau_do_am_max: "",
  tranh_anh_sang: false,
  tranh_rung_động: false,
  hang_de_vo: false,
  hang_nguy_hiem: false,
  trang_thai: "Hoạt_động",
  expanded: false
}

const QuanLyHangHoaTree = () => {
  // State quản lý nhóm hang
  const [productGroups, setProductGroups] = useState([])
  const [productByGroup, setProductByGroup] = useState({}) // { [areaId]: [positions] }
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [formProductGroup, setFormProductGroup] = useState(DEFAULT_NHOMHANG)
  const [showGroupModal, setShowGroupModal] = useState(false)

  // State quản lý sản phẩm
  const [suppliers, setSuppliers] = useState([])
  const [product, setProduct] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [formProduct, setFormProduct] = useState(DEFAULT_SANPHAM)
  const [showProductModal, setShowProductModal] = useState(false)

  // State filter/search
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

  // Fetch danh sách nhóm hang khi mount
  useEffect(() => {
    fetchProductGroup()
  }, [])

  useEffect(() => {
    fetchSuppliers()
  }, [])

  // Fetch sản phẩm cho từng nhóm hang khi danh sách nhóm hang thay đổi
  useEffect(() => {
    productGroups.forEach(group => {
      fetchProductByGroupId(group.id)
    })
  }, [productGroups])

  // API: Lấy danh sách khu vực
  const fetchProductGroup = async () => {
    try {
      const res = await axios.get("http://localhost:8000/quanlykho/nhomhang/")
      setProductGroups(res.data)
    } catch (err) {
      toast.error("Không thể tải danh sách các nhóm hàng!")
    }
  }

  // API: Lấy danh sách vị trí theo khu vực
  const fetchProductByGroupId = async (groupId) => {
    try {
      const res = await axios.get(`http://localhost:8000/quanlykho/sanpham/?nhom_hang=${groupId}`)
      setProductByGroup(prev => ({ ...prev, [groupId]: res.data }))
    } catch (err) {
      toast.error("Không thể tải danh sách sản phẩm!")
    }
  }

  // API: Lấy danh sách nha cung cấp
  const fetchSuppliers = async (supplier) => {
    try {
      const res = await axios.get(`http://localhost:8000/quanlykho/nhacungcap`)
      setSuppliers(res.data)
    } catch (err) {
      toast.error("Không thể tải danh sách nhà cung cấp!")
    }
  }

  const filteredProductGroup = productGroups.filter(group => {
    const matchesGroup =
      group.ten_nhom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.ma_nhom?.toLowerCase().includes(searchTerm.toLowerCase())

    // Nếu có sản phẩm nào trong nhóm khớp từ khóa thì cũng hiển thị nhóm này
    const hasProductMatch = (productByGroup[group.id] || []).some(product =>
      product.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.ma_san_pham?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return matchesGroup || hasProductMatch
  })

  // Xử lý mở modal thêm/sửa nhóm hang
  const handleOpenGroupModal = (group = null) => {
    setSelectedGroup(group)
    setFormProductGroup(group ? { ...group } : DEFAULT_NHOMHANG)
    setShowGroupModal(true)
  }

  // Xử lý submit form khu vực
  const handleSubmitProductGroup = async (e) => {
    e.preventDefault()
    try {
      if (selectedGroup) {
        await axios.put(`http://localhost:8000/quanlykho/nhomhang/${selectedGroup.id}/`, formProductGroup)
        toast.success("Cập nhật nhóm hàng thành công!")
      } else {
        await axios.post("http://localhost:8000/quanlykho/nhomhang/", formProductGroup)
        toast.success("Thêm nhóm hàng thành công!")
      }
      setShowGroupModal(false)
      setSelectedGroup(null)
      setFormProductGroup(DEFAULT_NHOMHANG)
      fetchProductGroup()
    } catch (err) {
      toast.error("Có lỗi khi lưu nhóm hàng!")
    }
  }

  const handleDeleteGroupProduct = async (group) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhóm này?")) return
    try {
      await axios.delete(`http://localhost:8000/quanlykho/nhomhang/${group.id}/`)
      toast.success("Xóa nhóm hàng thành công!")
      setSelectedGroup(null)
      fetchProductGroup()
    } catch (err) {
      toast.error("Không thể xóa nhóm hàng! Vẫn còn sản phẩm trong nhóm!")
    }
  }

  const handleOpenProductModal = (product = null) => {
    setSelectedProduct(product)
    setFormProduct(product ? { ...product } : DEFAULT_SANPHAM)
    setShowProductModal(true)
  }

  const handleSubmitProduct = async (e) => {
    e.preventDefault()
    try {
      if (formProduct.id) {
        await axios.put(`http://localhost:8000/quanlykho/sanpham/${formProduct.id}/`, formProduct)
        toast.success("Cập nhật sản phẩm thành công!")
      } else {
        await axios.post("http://localhost:8000/quanlykho/sanpham/", formProduct)
        toast.success("Thêm sản phẩm thành công!")
      }
      setShowProductModal(false)
      fetchProductByGroupId(formProduct.nhom_hang)
      setFormProduct(DEFAULT_SANPHAM)
    } catch (err) {
      toast.error("Lỗi! Kiểm tra các trường nhập vào!")
    }
  }

  const handleDeleteProduct = async (product) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return
    try {
      await axios.delete(`http://localhost:8000/quanlykho/sanpham/${product.id}/`)
      toast.success("Xóa sản phẩm thành công!")
      setSelectedProduct(null)
      fetchProductByGroupId(product.nhom_hang) 
    } catch (err) {
      toast.error("Lỗi! Sản phẩm này vẫn còn pallets!")
    }
  }

  const toggleGroup = (groupId) => {
    setProductGroups(prev =>
      prev.map(g =>
        g.id === groupId ? { ...g, expanded: !g.expanded } : g
      )
    )
  }

  const getStockColor = (unit) => {
    switch (unit) {
      case "thùng":
        return "#ef4444"
      case "chai":
        return "#f59e0b"
      case "lốc":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  return (
    <div className="quan-ly-hang-hoa-tree">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Header */}
      <div className="page-header">
        <div className="header-actions">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm nhóm hàng, sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="action-buttons">
            <button className="btn btn-outline" onClick={() => setShowGroupModal(true)}>
              <Plus size={20} />
              Thêm nhóm hàng
            </button>
            <button className="btn btn-primary" onClick={() => setShowProductModal(true)}>
              <Plus size={20} />
              Thêm sản phẩm
            </button>
          </div>
        </div>
      </div>

      <div className="product-tree">
        {filteredProductGroup.map((group) => (
          <div key={group.id} className="product-group">
            <div className="group-header" onClick={() => toggleGroup(group.id)}>
              <div className="group-toggle">
                {group.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </div>
              <div className="group-info">
                <span className="group-icon">{group.icon}</span>
                <span className="group-name">
                  {group.ten_nhom} ({(productByGroup[group.id]?.length || 0)} sản phẩm)
                </span>
              </div>
              <div className="group-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="action-btn"
                  title="Sửa nhóm hàng"
                  onClick={() => handleOpenGroupModal(group)}
                  style={{ borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center" }}
                >
                  <Edit size={14} /> 
                </button>
                <button
                  className="action-btn delete"
                  title="Xóa nhóm hàng"
                  onClick={() => handleDeleteGroupProduct(group)}
                  style={{ borderRadius: "50%", width: 56, height: 56, display: "flex", alignItems: "center", justifyContent: "center", color: "#dc3545" }}
                >
                  <Trash2 size={14} /> 
                </button>
              </div>
            </div>

            {group.expanded && (
              <div className="products-list">
                {(productByGroup[group.id] || [])
                .filter(product =>
                    !searchTerm ||
                    product.ten_san_pham?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.ma_san_pham?.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                .map((product) => (
                  <div key={product.id} className="product-item">
                    <div className="product-info">
                      {product.don_vi_tinh === "chai" ? (
                        <Wine size={16} />
                      ) : product.don_vi_tinh === "thùng" ? (
                        <Box size={16} />
                      ) : product.don_vi_tinh === "lốc" ? (
                        <Package2 size={16} />
                      ) : (
                        <Package size={16} />
                      )}
                      <div className="product-details">
                        <span className="product-name">{product.ten_san_pham}</span>
                        <div className="product-stock">
                          <span className="stock-value" style={{ color: getStockColor(product.don_vi_tinh) }}>
                            Stock: {product.dung_tich} {product.don_vi_tinh}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="group-actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="action-btn"
                        title="Sửa nhóm hàng"
                        onClick={() => handleOpenProductModal(product)}
                        style={{ borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center" }}
                      >
                        <Edit size={14} /> 
                      </button>
                      <button
                        className="action-btn delete"
                        title="Xóa nhóm hàng"
                        onClick={() => handleDeleteProduct(product)}
                        style={{ borderRadius: "50%", width: 46, height: 46, display: "flex", alignItems: "center", justifyContent: "center", color: "#dc3545" }}
                      >
                        <Trash2 size={14} /> 
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal thêm nhóm hàng */}
      <Modal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)} title="Thêm nhóm hàng mới">
        <form className="group-form" onSubmit={handleSubmitProductGroup}>
          <div className="form-group">
            <label>Mã nhóm hàng</label>
            <input type="text" placeholder="Nhập mã nhóm hàng" 
              value={formProductGroup.ma_nhom}
              onChange={e => setFormProductGroup({ ...formProductGroup, ma_nhom: e.target.value })}
              required/>
          </div>
          <div className="form-group">
            <label>Tên nhóm hàng</label>
            <input type="text" placeholder="Nhập tên nhóm hàng" 
              value={formProductGroup.ten_nhom}
              onChange={e => setFormProductGroup({ ...formProductGroup, ten_nhom: e.target.value })}
              required/>
          </div>
          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              <button type="button" 
                className={`icon-option${formProductGroup.icon === "🍋" ? " selected" : ""}`}
                onClick={() => setFormProductGroup({ ...formProductGroup, icon: "🍋" })}>
                🍋
              </button>
              <button type="button" 
                className={`icon-option${formProductGroup.icon === "🍊" ? " selected" : ""}`}
                onClick={() => setFormProductGroup({ ...formProductGroup, icon: "🍊" })}>
                🍊
              </button>
              <button type="button" className={`icon-option${formProductGroup.icon === "🍈" ? " selected" : ""}`}
                onClick={() => setFormProductGroup({ ...formProductGroup, icon: "🍈" })}>
                🍈
              </button>
              <button type="button" className={`icon-option${formProductGroup.icon === "🍉" ? " selected" : ""}`}
                onClick={() => setFormProductGroup({ ...formProductGroup, icon: "🍉" })}>
                🍉
              </button>
              <button type="button" className={`icon-option${formProductGroup.icon === "🍌" ? " selected" : ""}`}
                onClick={() => setFormProductGroup({ ...formProductGroup, icon: "🍌" })}>
                🍌
              </button>
              <button type="button" className={`icon-option${formProductGroup.icon === "🥥" ? " selected" : ""}`}
                onClick={() => setFormProductGroup({ ...formProductGroup, icon: "🥥" })}>
                🥥
              </button>
            </div>
          </div>
          <div className="form-group">
            <label>Mô tả</label>
            <textarea rows="3" placeholder="Mô tả nhóm hàng..."
              value={formProductGroup.mo_ta}
              onChange={e => setFormProductGroup({ ...formProductGroup, mo_ta: e.target.value })}></textarea>
          </div>
          <div className="form-group">
            <label>Màu sắc</label>
            <input type="text" placeholder="Nhập màu sắc" 
              value={formProductGroup.mau_sac}
              onChange={e => setFormProductGroup({ ...formProductGroup, mau_sac: e.target.value })}/>
          </div>
          
          <div className="form-section">
            <h4>Yêu cầu bảo quản</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Nhiệt độ (°C)</label>
                <div className="range-inputs">
                  <input type="number" 
                    value={formProductGroup.yeu_cau_nhiet_do_min}
                    onChange={e => setFormProductGroup({ ...formProductGroup, yeu_cau_nhiet_do_min: e.target.value })}/>
                  <span>-</span>
                  <input type="number" 
                    value={formProductGroup.yeu_cau_nhiet_do_max}
                    onChange={e => setFormProductGroup({ ...formProductGroup, yeu_cau_nhiet_do_max: e.target.value })}/>
                </div>
              </div>
              <div className="form-group">
                <label>Độ ẩm (%)</label>
                <div className="range-inputs">
                  <input type="number" 
                    value={formProductGroup.yeu_cau_do_am_min}
                    onChange={e => setFormProductGroup({ ...formProductGroup, yeu_cau_do_am_min: e.target.value })}/>
                  <span>-</span>
                  <input type="number" 
                    value={formProductGroup.yeu_cau_do_am_max}
                    onChange={e => setFormProductGroup({ ...formProductGroup, yeu_cau_do_am_max: e.target.value })}/>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Tránh ánh sáng</label>
            <input type="checkbox"
              value={formProductGroup.tranh_anh_sang}
              onChange={e => setFormProductGroup({ ...formProductGroup, tranh_anh_sang: e.target.checked })}/>
          </div>
          <div className="form-group">
            <label>Tránh rung động</label>
            <input type="checkbox"
              value={formProductGroup.tranh_rung_động}
              onChange={e => setFormProductGroup({ ...formProductGroup, tranh_rung_động: e.target.checked })}/>
          </div>
          <div className="form-group">
            <label>Hàng dễ vỡ</label>
            <input type="checkbox"
              value={formProductGroup.hang_de_vo}
              onChange={e => setFormProductGroup({ ...formProductGroup, hang_de_vo: e.target.checked })}/>
          </div>
          <div className="form-group">
            <label>Hàng nguy hiểm</label>
            <input type="checkbox"
              value={formProductGroup.hang_nguy_hiem}
              onChange={e => setFormProductGroup({ ...formProductGroup, hang_nguy_hiem: e.target.checked })}/>
          </div>
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              value={formProductGroup.trang_thai}
              onChange={e => setFormProductGroup({ ...formProductGroup, trang_thai: e.target.value })}
            >
              <option value="Hoạt_động">Hoạt động</option>
              <option value="Ngừng">Ngừng</option>
            </select>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowGroupModal(false)}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              {selectedGroup ? "Sửa" : "Thêm mới"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal thêm sản phẩm */}
      <Modal
        isOpen={showProductModal}
        onClose={() => {
            setShowProductModal(false)
            setSelectedProduct(null) // Thêm dòng này
            setFormProduct(DEFAULT_SANPHAM)
          }}   
        size="large"
      >
        <form className="product-form" onSubmit={handleSubmitProduct}>
          <div className="form-row">
            <div className="form-group">
              <label>Mã sản phẩm</label>
              <input type="text" placeholder="Nhập mã sản phẩm"
              value={formProduct.ma_san_pham}
              onChange={e => setFormProduct({ ...formProduct, ma_san_pham: e.target.value })}/>
              <small>Mã tự động sinh</small>
            </div>
            <div className="form-group">
              <label>Tên sản phẩm</label>
              <input type="text" placeholder="Nhập tên sản phẩm" 
              value={formProduct.ten_san_pham}
              onChange={e => setFormProduct({ ...formProduct, ten_san_pham: e.target.value })}/>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Chọn nhóm hàng</label>
              <select
                value={formProduct.nhom_hang}
                onChange={e => setFormProduct({ ...formProduct, nhom_hang: e.target.value })}
                required
              >
                <option value="">Nhóm hàng</option>
                {productGroups.map(group => (
                  <option key={group.id} value={group.id}>
                    {group.ma_nhom} - {group.ten_nhom}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Thương hiệu</label>
              <input type="text" placeholder="Nhập thương hiệu" 
              value={formProduct.thuong_hieu}
              onChange={e => setFormProduct({ ...formProduct, thuong_hieu: e.target.value })}/>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Dung tích </label>
              <input type="number" 
              value={formProduct.dung_tich}
              onChange={e => setFormProduct({ ...formProduct, dung_tich: e.target.value })}/>
            </div>
            <div className="form-group">
              <label>Đơn vị tính</label>
              <select
              value={formProduct.don_vi_tinh}
                onChange={e => setFormProduct({ ...formProduct, don_vi_tinh: e.target.value })}
                required>
                <option value="thùng">Thùng</option>
                <option value="chai">Chai</option>
                <option value="lốc">Lốc</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Số lượng/thùng</label>
            <input type="number"
              value={formProduct.so_luong_per_thung}
              onChange={e => setFormProduct({ ...formProduct, so_luong_per_thung: e.target.value })}/>
          </div>

          <div className="form-section">
            <h4>Thông tin bổ sung</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Mã vạch</label>
                <input type="text" placeholder="Nhập mã vạch" 
                  value={formProduct.ma_vach}
                  onChange={e => setFormProduct({ ...formProduct, ma_vach: e.target.value })}/>
              </div>
              <div className="form-group">
                <label>Chọn nhà cung cấp</label>
                <select
                  value={formProduct.nha_cung_cap}
                  onChange={e => setFormProduct({ ...formProduct, nha_cung_cap: e.target.value })}
                  required
                >
                  <option value="">Nhà cung cấp</option>
                  {suppliers.map(supplier => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.ma_nha_cung_cap} - {supplier.ten_nha_cung_cap}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Trạng thái</label>
                <select
                  value={formProduct.trang_thai}
                  onChange={e => setFormProduct({ ...formProduct, trang_thai: e.target.value })}
                >
                  <option value="Hoạt_động">Hoạt động</option>
                  <option value="Ngừng">Ngừng</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Hạn sử dụng mặc định</label>
                <input type="number"
                  value={formProduct.han_su_dung_mac_dinh}
                  onChange={e => setFormProduct({ ...formProduct, han_su_dung_mac_dinh: e.target.value })}/>
              </div>
              <div className="form-group">
                <label>Chu kỳ kiểm tra CL</label>
                <input type="number" 
                  value={formProduct.chu_ky_kiem_tra_cl}
                  onChange={e => setFormProduct({ ...formProduct, chu_ky_kiem_tra_cl: e.target.value })}/>
              </div>
            </div>

            <div className="form-group">
              <label>Mô tả</label>
              <textarea rows="3" placeholder="Mô tả thêm về sản phẩm..."
              value={formProduct.mo_ta}
              onChange={e => setFormProduct({ ...formProduct, mo_ta: e.target.value })}></textarea>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => setShowProductModal(false)}>
              ❌ Hủy
            </button>
            <button type="submit" className="btn btn-primary">
              💾 Lưu
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default QuanLyHangHoaTree
