"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Package, MapPin, AlertTriangle, TrendingUp, Wrench, CheckCircle, BarChart3 } from "lucide-react"

const DEFAULT_DASHBOARD = {
  tong_vi_tri: "",
  tong_pallets: "",
  can_bao_tri: "",
  ty_le_su_dung: "",
  trong: "",
  day: "",
  bao_tri: "",
  hieu_suat: "",
  pallets_sap_het_han: "",
  khu_vuc_can_bao_tri: "",
  vi_tri_can_bao_tri: "",
  tinh_trang: "",
  pallets_can_kiem_tra_cl: ""
}

const DashboardKho = () => {
  const [dashboard, setDashboard] = useState(DEFAULT_DASHBOARD)

  const formatList = (list, max = 3) => {
    if (!Array.isArray(list)) return "";
    if (list.length === 0) return "";
    if (list.length <= max) return list.join(", ");
    return list.slice(0, max).join(", ") + ", ...";
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axios.get("http://localhost:8000/quanlykho/vitrikho/dashboard_quan_ly_kho/")
        setDashboard({
          ...res.data,
          khu_vuc_can_bao_tri: Array.isArray(res.data.khu_vuc_can_bao_tri) ? res.data.khu_vuc_can_bao_tri : [],
          vi_tri_can_bao_tri: Array.isArray(res.data.vi_tri_can_bao_tri) ? res.data.vi_tri_can_bao_tri : [],
        })
      } catch (err) {
        // Bạn có thể dùng toast.error nếu muốn
        console.error("Không lấy được dữ liệu dashboard!")
      }
    }
    fetchDashboard()
  }, [])

  // Cấu hình các card tổng quan
  const overviewCards = [
    {
      title: "Tổng vị trí",
      value: dashboard.tong_vi_tri,
      icon: MapPin,
      color: "#3b82f6",
      subtitle: "Tất cả vị trí trong kho"
    },
    {
      title: "Tổng pallets",
      value: dashboard.tong_pallets,
      icon: Package,
      color: "#10b981",
      subtitle: "Tổng số pallet"
    },
    {
      title: "Cần bảo trì",
      value: dashboard.can_bao_tri,
      icon: Wrench,
      color: "#f59e0b",
      subtitle: "Vị trí cần bảo trì"
    },
    {
      title: "Tỷ lệ sử dụng",
      value: dashboard.ty_le_su_dung,
      icon: TrendingUp,
      color: "#6366f1",
      subtitle: "Tỷ lệ sử dụng kho"
    },
    {
      title: "Vị trí trống",
      value: dashboard.trong,
      icon: CheckCircle,
      color: "#10b981",
      subtitle: "Vị trí chưa sử dụng"
    },
    {
      title: "Vị trí đầy",
      value: dashboard.day,
      icon: BarChart3,
      color: "#ef4444",
      subtitle: "Vị trí đã đầy"
    },
    {
      title: "Vị trí bảo trì",
      value: formatList(dashboard.vi_tri_can_bao_tri),
      icon: Wrench,
      color: "#f59e0b",
      subtitle: "Đang bảo trì"
    },
    {
      title: "Hiệu suất",
      value: dashboard.hieu_suat,
      icon: TrendingUp,
      color: "#3b82f6",
      subtitle: "Hiệu suất kho"
    },
    {
      title: "Pallets sắp hết hạn",
      value: dashboard.pallets_sap_het_han,
      icon: AlertTriangle,
      color: "#ef4444",
      subtitle: "Cảnh báo hết hạn"
    },
    {
      title: "Khu vực cần bảo trì",
      value: formatList(dashboard.khu_vuc_can_bao_tri),
      icon: Wrench,
      color: "#f59e0b",
      subtitle: "Khu vực cần bảo trì"
    },
    {
      title: "Tình trạng",
      value: dashboard.tinh_trang,
      icon: CheckCircle,
      color: "#10b981",
      subtitle: "Tình trạng tổng thể"
    },
    {
      title: "Pallets cần kiểm tra CL",
      value: dashboard.pallets_can_kiem_tra_cl,
      icon: AlertTriangle,
      color: "#f59e0b",
      subtitle: "Cần kiểm tra chất lượng"
    }
  ]

  // ...giữ nguyên các hàm getPriorityColor, getStatusColor, và phần render như cũ...

  return (
    <div className="dashboard-kho">
      {/* Tổng quan */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Tổng quan</h2>
          <span className="section-subtitle">Cập nhật lúc: {new Date().toLocaleTimeString("vi-VN")}</span>
        </div>

        <div className="overview-grid">
          {overviewCards.map((card, index) => (
            <div key={index} className="overview-card">
              <div className="card-content">
                <div className="card-info">
                  <h3 className="card-title">{card.title}</h3>
                  <div className="card-value">{card.value}</div>
                  <p className="card-subtitle">{card.subtitle}</p>
                </div>
                <div className="card-icon" style={{ backgroundColor: `${card.color}20` }}>
                  <card.icon size={24} style={{ color: card.color }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ...giữ nguyên phần cảnh báo và hoạt động gần đây... */}
    </div>
  )
}

export default DashboardKho