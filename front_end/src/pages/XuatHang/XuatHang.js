"use client"

import axios from "axios"
import { useState, useEffect } from "react"
import { Search, Filter, Eye, Truck, Package, CheckCircle, Clock, QrCode, AlertTriangle } from "lucide-react"
import Modal from "../../components/common/Modal"
import ChiTietDonXuat from "./ChiTietDonXuat"
import ChecklistPallet from "./ChecklistPallet"
import InQRDonHang from "./InQRDonHang"
import "./XuatHang.css"

const statusOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "Chờ_xuất", label: "Chờ xuất" },
  { value: "Đang_xuất", label: "Đang xuất" },
  { value: "Hoàn_thành", label: "Hoàn thành" },
  { value: "Hủy", label: "Đã hủy" },
]

const XuatHang = () => {
  const [orders, setOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showChecklistModal, setShowChecklistModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [alertMessage, setAlertMessage] = useState(null)
  const [inventory, setInventory] = useState({})

  const fetchOrders = () => {
    axios
      .get("http://localhost:8000/taodon/donxuat")
      .then((res) => {
        const data = res.data || []
        setOrders(
          data.map((p) => ({
            ...p,
          }))
        )
      })
      .catch(() => setOrders([]))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.ma_don?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cua_hang?.ten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.cua_hang?.khu_vuc?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || order.trang_thai === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      Chờ_xuất: { label: "Chờ xuất", class: "badge-warning" },
      Đang_xuất: { label: "Đang xuất", class: "badge-info" },
      Hoàn_thành: { label: "Hoàn thành", class: "badge-success" },
      Hủy: { label: "Đã hủy", class: "badge-danger" },
    }
    const config = statusConfig[status] || statusConfig["Chờ_xuất"]
    return <span className={`badge ${config.class}`}>{config.label}</span>
  }

  // Tính tiến độ xuất hàng (nếu có trường chi tiết sản phẩm)
  const getOrderProgress = (order) => {
    // Nếu có trường chi tiết sản phẩm, tính toán ở đây
    // Ví dụ: return Math.round((order.san_pham_da_xuat / order.tong_san_pham) * 100)
    return order.tien_do || 0
  }

  const handleViewDetail = (order) => {
    console.log("Order được chọn:", order)
    setSelectedOrder(order)
    setShowDetailModal(true)
  }

  const handleStartChecklist = (order) => {
    setSelectedOrder(order)
    setShowChecklistModal(true)
  }

  const handlePrintQR = (order) => {
    setSelectedOrder(order)
    setShowQRModal(true)
  }

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, trang_thai: newStatus } : order)))
  }

  // Nếu có cập nhật tồn kho, viết hàm updateAllocationStatus ở đây

  return (
    <div className="xuat-hang">
      <div className="page-header">
        <div>
          <h1 className="page-title">Xuất hàng</h1>
          <p className="page-subtitle">Quản lý và xử lý các đơn xuất kho</p>
        </div>
      </div>

      {alertMessage && (
        <div className="alert-message">
          <AlertTriangle size={16} />
          <span>{alertMessage}</span>
          <button className="close-alert" onClick={() => setAlertMessage(null)}>
            ×
          </button>
        </div>
      )}

      <div className="filters-section">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, cửa hàng, khu vực..."
            className="form-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="form-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ maxWidth: "200px" }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <button className="btn btn-secondary">
          <Filter size={16} />
          Bộ lọc nâng cao
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Clock size={24} style={{ color: "#ffc107" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "Chờ_xuất").length}</div>
            <div className="stat-label">Đơn chờ xuất</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Package size={24} style={{ color: "#17a2b8" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "Đang_xuất").length}</div>
            <div className="stat-label">Đang xuất</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <Truck size={24} style={{ color: "#28a745" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "Hoàn_thành").length}</div>
            <div className="stat-label">Hoàn thành</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <CheckCircle size={24} style={{ color: "#00FF33" }} />
          </div>
          <div className="stat-info">
            <div className="stat-value">{orders.filter((o) => o.trang_thai === "Hủy").length}</div>
            <div className="stat-label">Đã hủy</div>
          </div>
        </div>
      </div>

      <div className="orders-table card">
        <div className="card-header">
          <h3 className="card-title">Danh sách đơn xuất ({filteredOrders.length})</h3>
          <p className="card-subtitle">Quản lý và theo dõi tiến độ xuất hàng</p>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Mã đơn xuất</th>
                  <th>Cửa hàng</th>
                  <th>Ngày giao</th>
                  <th>Trạng thái</th>
                  <th>Người tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="order-info">
                        <span className="order-code">{order.ma_don}</span>
                      </div>
                    </td>
                    <td>
                      <div className="store-info">
                        <span className="store-name">{order.ten_cua_hang}</span>
                      </div>
                    </td>
                    <td>{order.ngay_giao ? new Date(order.ngay_giao).toLocaleDateString("vi-VN") : ""}</td>
                    <td>{getStatusBadge(order.trang_thai)}</td>
                    <td>{order.nguoi_tao}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn-action view"
                          onClick={() => handleViewDetail(order)}
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          className="btn-action checklist"
                          onClick={() => handleStartChecklist(order)}
                          title="Checklist"
                          disabled={order.trang_thai === "Hoàn_thành"}
                        >
                          <CheckCircle size={14} />
                        </button>
                        <button className="btn-action qr" onClick={() => handlePrintQR(order)} title="In QR Code">
                          <QrCode size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} style={{ textAlign: "center" }}>
                      Không có dữ liệu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title="Chi tiết đơn xuất">
        {selectedOrder && (
          <ChiTietDonXuat
            donXuatId={selectedOrder.id}
            onClose={() => setShowDetailModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={showChecklistModal} onClose={() => setShowChecklistModal(false)} title="Checklist xuất hàng">
        {selectedOrder && (
          <ChecklistPallet
            order={selectedOrder}
            inventory={inventory}
            onUpdateOrderStatus={updateOrderStatus}
            onClose={() => setShowChecklistModal(false)}
          />
        )}
      </Modal>

      <Modal isOpen={showQRModal} onClose={() => setShowQRModal(false)} title="QR Code đơn xuất">
        {selectedOrder && <InQRDonHang order={selectedOrder} onClose={() => setShowQRModal(false)} />}
      </Modal>
    </div>
  )
}

export default XuatHang