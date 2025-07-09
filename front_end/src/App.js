import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { NotificationProvider } from "./context/NotificationContext"
import Header from "./components/common/Header"
import Sidebar from "./components/common/Sidebar"
import Footer from "./components/common/Footer"
import Dashboard from "./pages/Dashboard/Dashboard"
import NhapHang from "./pages/NhapHang/NhapHang"
import TaoDon from "./pages/TaoDon/TaoDon"
import XuatHang from "./pages/XuatHang/XuatHang"
import KiemTraGiaoHang from "./pages/KiemTraGiaoHang/KiemTraGiaoHang"
import QuanLyKho from "./pages/QuanLyKho/QuanLyKho"
import QuanLyViTri from "./pages/QuanLyKho/QuanLyViTri";
import HienThiQR from "./pages/NhapHang/HienThiQR";
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="app">
            <Header />
            <div className="app-body">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/nhap-hang" element={<NhapHang />} />
                  <Route path="/nhap-hang/*" element={<NhapHang />} />
                  <Route path="/tao-don/*" element={<TaoDon />} />
                  <Route path="/xuat-hang/*" element={<XuatHang />} />
                  <Route path="/kiem-tra/*" element={<KiemTraGiaoHang />} />
                  <Route path="/quan-ly-kho/*" element={<QuanLyKho />} />
                  <Route path="/quan-ly-kho/vi-tri/:areaId" element={<QuanLyViTri />} />
                  <Route path="/nhap-hang/scan" element={<HienThiQR />} />

                </Routes>
              </main>
            </div>
          </div>
          <Footer/>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  )
}

export default App
