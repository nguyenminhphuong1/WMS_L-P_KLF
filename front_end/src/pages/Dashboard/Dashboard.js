import DashboardWidgets from "./DashboardWidgets"
import { PieChart, Pie, Tooltip, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  LineChart, Line, Legend,
  Radar, } from "recharts"
import { TrendingUp, Package, Users, ShoppingCart } from "lucide-react"
import "./Dashboard.css"
import { useState, useEffect } from "react"

const Dashboard = () => {
  const [selectedChart, setSelectedChart] = useState("pie");
  // Mock data
  const statsData = [
    {
      title: "Tổng hàng tồn",
      value: "1,250 kg",
      change: "+12%",
      icon: Package,
      color: "var(--primary-color)",
    },
    {
      title: "Đơn nhập hôm nay",
      value: "24 đơn",
      change: "+8%",
      icon: ShoppingCart,
      color: "var(--success-color)",
    },
    {
      title: "Nhà cung cấp",
      value: "15 đối tác",
      change: "0%",
      icon: Users,
      color: "var(--info-color)",
    },
    {
      title: "Doanh thu tháng",
      value: "125M VNĐ",
      change: "+15%",
      icon: TrendingUp,
      color: "var(--warning-color)",
    },
  ]

  // const chartData = [
  //   { name: "Táo", value: 150, color: "#EF5350" },
  //   { name: "Cam", value: 200, color: "	#FFA726" },
  //   { name: "Chuối", value: 80, color: "#FFEB3B" },
  //   { name: "Xoài", value: 120, color: "#FBC02D" },
  //   { name: "Nho", value: 90, color: "#8E24AA" },
  // ]

  const chartData = [
    { name: "Cam", value: 200, color: "#FFA500" },     
    { name: "Xoài", value: 120, color: "#FBC02D" },    
    { name: "Bơ", value: 100, color: "#4CAF50" },      
    { name: "Nho", value: 90, color: "#8E24AA" },     
    { name: "Táo", value: 150, color: "#EF5350" }      
  ]

  const chart01 = [
    { name: "Cam", thùng: 20, color: "#20A9A3" },     
    { name: "Xoài", thùng: 12, color: "#20A9A3" },    
    { name: "Bơ", thùng: 10, color: "#20A9A3" },      
    { name: "Nho", thùng: 9, color: "#20A9A3" },     
    { name: "Táo", thùng: 15, color: "#20A9A3" } 
  ]

  const chart02 = [
    { name: "Cam", value: 10, color: "#FFA500" },     
    { name: "Xoài", value: 6, color: "#FBC02D" },    
    { name: "Bơ", value: 5, color: "#4CAF50" },      
    { name: "Nho", value: 4, color: "#8E24AA" },     
    { name: "Táo", value: 7, color: "#EF5350" } 
  ]
  
  
  const twoLineChart = [
  { month: 'Jan', in: 2000, out: 2400 },
  { month: 'Feb', in: 2500, out: 2450 },
  { month: 'Mar', in: 2300, out: 3000 },
  { month: 'Apr', in: 2500, out: 3200 },
  { month: 'May', in: 3000, out: 3400 },
];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-subtitle">Tổng quan quản lý hoa quả sạch</p>
        </div>
        <div className="dashboard-date">
          <span className="badge badge-primary">Hôm nay: {new Date().toLocaleDateString("vi-VN")}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsData.map((stat, index) => (
          <div key={index} className="stat-card card">
            <div className="card-body">
              <div className="stat-content">
                <div className="stat-info">
                  <h3 className="stat-title">{stat.title}</h3>
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-change">
                    <span className={`change ${stat.change.startsWith("+") ? "positive" : "neutral"}`}>
                      {stat.change} so với kỳ trước
                    </span>
                  </div>
                </div>
                <div className="stat-icon" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon size={24} style={{ color: stat.color }} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card card">
          <div className="card-header">
            <h2 className="order-code">Số lượng hàng tồn kho</h2>
            <p className="card-subtitle">Cập nhật theo đơn vị</p>
            <div className="detail-actions" style={{ marginTop: 10 }}>
              <button className="btn btn-secondary" onClick={() => setSelectedChart("pie")}>Kilogram</button>
              <button className="btn btn-secondary" onClick={() => setSelectedChart("bar")}>Thùng</button>
              <button className="btn btn-secondary" onClick={() => setSelectedChart("line")}>Pallet</button>
            </div>
          </div>
          <div className="card-body" style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              {selectedChart === "pie" && (
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}kg`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              )}

              {selectedChart === "bar" && (
                <BarChart data={chart01}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 25]}/>
                  <Tooltip />
                  <Bar dataKey="thùng">
                    {chart01.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {selectedChart === "line" && (
                <RadarChart data={chart02}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis angle={30} domain={[0, 12]} />
                  <Radar
                    name="Tồn kho"
                    dataKey="value"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
    

        <div className="chart-card card">
          <div className="card-header">
            <h2 className="order-code">Số lượng nhập/xuất theo tháng</h2>
            <p className="card-subtitle">Số lượng theo biểu đồ thời gian</p>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={twoLineChart}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[1500, 3500]}/>
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="in" stroke="red" name="Stock in" />
                <Line type="monotone" dataKey="out" stroke="green" name="Stock out" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <DashboardWidgets />
    </div>
  )
}

export default Dashboard
