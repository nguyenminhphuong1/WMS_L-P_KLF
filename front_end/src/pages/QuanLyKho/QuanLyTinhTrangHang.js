"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import { AlertTriangle, CheckCircle, X, Rocket, Edit, Search } from "lucide-react"

const QuanLyTinhTrangHang = () => {
  const [expiringItems, setExpiringItems] = useState([])
  const [qualityCheckItems, setQualityCheckItems] = useState([])
  const [problemItems, setProblemItems] = useState([])
  const [filterType, setFilterType] = useState("all")
  const [filterDate, setFilterDate] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  // Fetch dữ liệu từ API và phân loại
  const fetchAllPallets = async () => {
    setLoading(true)
    try {
      const res = await axios.get("http://localhost:8000/nhaphang/pallets/")
      const data = res.data

      const now = new Date()
      const expiring = []
      const quality = []
      const problems = []

      data.forEach((item) => {
        // Hàng sắp hết hạn: còn dưới 7 ngày
        const expiryDate = new Date(item.han_su_dung)
        const daysLeft = Math.ceil((expiryDate - now) / (1000 * 60 * 60 * 24))
        if (daysLeft <= 7 & expiryDate > now) {
          expiring.push({
            id: item.ma_pallet,
            product: item.ten_san_pham,
            expiryDate: item.han_su_dung,
            daysLeft,
            quantity: item.so_thung_con_lai,
            unit: "Thùng",
            location: item.ma_vi_tri_kho,
            priority: daysLeft <= 2 ? "urgent" : daysLeft <= 4 ? "high" : "medium",
          })
        }

        // Hàng cần kiểm tra chất lượng
        if (item.ngay_kiem_tra_cl) {
          const qualityCheckDate = new Date(item.ngay_kiem_tra_cl)
          const daysCheckLeft = Math.ceil((qualityCheckDate - now) / (1000 * 60 * 60 * 24))
          if (daysCheckLeft <= 3) {
            quality.push({
              id: item.ma_pallet,
              product: item.ten_san_pham,
              checkDate: item.ngay_kiem_tra_cl,
              status: "pending",
              location: item.ma_vi_tri_kho,
              checkedDate: null,
            })
          }
        }

        // Pallet hết hạn sử dụng
        if (expiryDate <= now) {
          problems.push({
            id: item.ma_pallet,
            product: item.ten_san_pham,
            expiryDate: item.han_su_dung,
            note: item.ghi_chu || "Không rõ",
            location: item.ma_vi_tri_kho,
            createdDate: item.ngay_san_xuat,
          })
        }
      })

      setExpiringItems(expiring)
      setQualityCheckItems(quality)
      setProblemItems(problems)
    } catch (err) {
      toast.error("Không thể tải danh sách pallets!")
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAllPallets()
  }, [])

  // Action
  const handlePriorityExport = (itemId) => {
    setExpiringItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, priority: "urgent" } : item))
    )
  }

  const handleQualityCheck = (itemId, status) => {
    setQualityCheckItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, status, checkedDate: new Date().toISOString() }
          : item
      )
    )
  }

  // Filter
  const filterByDate = (items, dateField) => {
    const now = new Date()
    return items.filter((item) => {
      const date = new Date(item[dateField])
      switch (filterDate) {
        case "today":
          return date.toDateString() === now.toDateString()
        case "week": {
          const weekStart = new Date(now)
          weekStart.setDate(now.getDate() - now.getDay())
          const weekEnd = new Date(weekStart)
          weekEnd.setDate(weekStart.getDate() + 6)
          return date >= weekStart && date <= weekEnd
        }
        case "month":
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
        default:
          return true
      }
    })
  }

  const filterBySearch = (items) => {
    if (!searchTerm) return items
    return items.filter(
      (item) =>
        item.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.id?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Màu sắc ưu tiên
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent":
        return "#dc2626"
      case "high":
        return "#ef4444"
      case "medium":
        return "#f59e0b"
      case "low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  // Lọc dữ liệu hiển thị
  const filteredExpiring = filterBySearch(filterByDate(expiringItems, "expiryDate"))
  const filteredQuality = filterBySearch(filterByDate(qualityCheckItems, "checkDate"))
  const filteredProblems = filterBySearch(filterByDate(problemItems, "createdDate"))

  return (
    <div className="quan-ly-tinh-trang-hang">
      <div className="page-header">
        <div className="filters-section">
          <div className="filter-controls">
            <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="all">Tất cả</option>
              <option value="expiring">Sắp hết hạn</option>
              <option value="quality">Cần kiểm tra CL</option>
              <option value="problems">Hết hạn</option>
            </select>
            <select className="filter-select" value={filterDate} onChange={(e) => setFilterDate(e.target.value)}>
              <option value="today">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="all">Tất cả</option>
            </select>
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="status-sections">
        {/* Hàng sắp hết hạn */}
        {(filterType === "all" || filterType === "expiring") && (
          <div className="status-section">
            <div className="section-header">
              <h3 className="section-title">
                <AlertTriangle size={20} className="warning-icon" />
                Hàng sắp hết hạn
              </h3>
              <span className="item-count">{filteredExpiring.length} mục</span>
            </div>
            <div className="items-container">
              {filteredExpiring.map((item) => (
                <div key={item.id} className="status-item expiring-item">
                  <div className="item-header">
                    <div className="item-info">
                      <span className="item-id">{item.id}</span>
                      <span className="item-product">{item.product}</span>
                      <span className="item-expiry">HSD: {new Date(item.expiryDate).toLocaleDateString("vi-VN")}</span>
                    </div>
                    <div
                      className="priority-badge"
                      style={{
                        backgroundColor: `${getPriorityColor(item.priority)}20`,
                        color: getPriorityColor(item.priority),
                      }}
                    >
                      {item.daysLeft} ngày
                    </div>
                  </div>
                  <div className="item-details">
                    <span className="detail-item">
                      Còn: {item.quantity} {item.unit}
                    </span>
                    <span className="detail-item">Vị trí: {item.location}</span>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn priority" onClick={() => handlePriorityExport(item.id)}>
                      <Rocket size={16} />
                      Ưu tiên xuất
                    </button>
                    <button className="action-btn note">
                      <Edit size={16} />
                      Ghi chú
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hàng cần kiểm tra CL */}
        {(filterType === "all" || filterType === "quality") && (
          <div className="status-section">
            <div className="section-header">
              <h3 className="section-title">
                <CheckCircle size={20} className="check-icon" />
                Hàng cần kiểm tra CL
              </h3>
              <span className="item-count">
                {filteredQuality.filter((item) => item.status === "pending").length} mục
              </span>
            </div>
            <div className="items-container">
              {filteredQuality.map((item) => (
                <div key={item.id} className={`status-item quality-item ${item.status}`}>
                  <div className="item-header">
                    <div className="item-info">
                      <span className="item-id">{item.id}</span>
                      <span className="item-product">{item.product}</span>
                      <span className="item-check-date">
                        Ngày CL: {item.checkDate ? new Date(item.checkDate).toLocaleDateString("vi-VN") : "--"}
                      </span>
                    </div>
                    <div className="status-badge">
                      {item.status === "pending"
                        ? "Chờ kiểm tra"
                        : item.status === "passed"
                        ? "Đã kiểm tra"
                        : "Có vấn đề"}
                    </div>
                  </div>
                  <div className="item-details">
                    <span className="detail-item">Vị trí: {item.location}</span>
                    {item.checkedDate && (
                      <span className="detail-item">
                        Kiểm tra: {new Date(item.checkedDate).toLocaleDateString("vi-VN")}
                      </span>
                    )}
                  </div>
                  {item.status === "pending" && (
                    <div className="item-actions">
                      <button className="action-btn success" onClick={() => handleQualityCheck(item.id, "passed")}>
                        <CheckCircle size={16} />
                        Đã kiểm tra
                      </button>
                      <button className="action-btn danger" onClick={() => handleQualityCheck(item.id, "failed")}>
                        <X size={16} />
                        Có vấn đề
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pallet mới */}
        {(filterType === "all" || filterType === "problems") && (
          <div className="status-section">
            <div className="section-header">
              <h3 className="section-title">
                <X size={20} className="error-icon" />
                Hết hạn sử dụng
              </h3>
              <span className="item-count">{filteredProblems.length} mục</span>
            </div>
            <div className="items-container">
              {filteredProblems.map((item) => (
                <div key={item.id} className="status-item problem-item">
                  <div className="item-header">
                    <div className="item-info">
                      <span className="item-id">{item.id}</span>
                      <span className="item-product">{item.product}</span>
                      <span className="item-issue">{item.note}</span>
                    </div>
                  </div>
                  <div className="item-details">
                    <span className="detail-item">Vị trí: {item.location}</span>
                    <span className="detail-item">
                      Ngày nhập: {item.createdDate ? new Date(item.createdDate).toLocaleDateString("vi-VN") : "--"}
                    </span>
                    <span className="detail-item">
                      Hạn sử dụng: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString("vi-VN") : "--"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Empty state */}
      {((filterType === "expiring" && filteredExpiring.length === 0) ||
        (filterType === "quality" && filteredQuality.length === 0) ||
        (filterType === "problems" && filteredProblems.length === 0)) && (
        <div className="empty-state">
          <CheckCircle size={48} />
          <h3>Không có mục nào cần xử lý</h3>
          <p>Tất cả hàng hóa đang trong tình trạng tốt</p>
        </div>
      )}
      {loading && <div className="loading">Đang tải dữ liệu...</div>}
    </div>
  )
}

export default QuanLyTinhTrangHang