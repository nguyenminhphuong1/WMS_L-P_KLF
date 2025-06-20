"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Package } from "lucide-react"

function ThemPallet({ onSubmit, onCancel }) {
  const [pallet, setPallet] = useState({
    ma_pallet: "", // Sẽ được tạo tự động
    san_pham: "", // ID sản phẩm (bắt buộc)
    nha_cung_cap: "", // ID nhà cung cấp (có thể null)
    so_thung_ban_dau: "", // Số nguyên dương
    so_thung_con_lai: "", // Sẽ bằng so_thung_ban_dau khi tạo mới
    vi_tri_kho: "", // ID vị trí kho
    ngay_san_xuat: "",
    han_su_dung: "",
    ngay_kiem_tra_cl: new Date().toISOString().slice(0, 10),
    trang_thai: "Mới", // Mặc định là "Mới"
    ghi_chu: "",
  })

  const [dropdownData, setDropdownData] = useState({
    ds_san_pham: [],
    ds_nha_cung_cap: [],
    ds_vi_tri_kho: []
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Danh sách trạng thái pallet
  const trangThaiOptions = [
    { value: 'Mới', label: 'Mới (chưa mở)' },
    { value: 'Đã_mở', label: 'Đã mở niêm phong' },
    { value: 'Trống', label: 'Trống (không còn hàng)' }
  ]

  // Hàm lấy mã pallet tự động
  const fetchNewPalletCode = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/nhaphang/pallets/auto_pallet/")
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Không thể tạo mã pallet")
      }
      const data = await response.json()
      if (!data.ma_pallet) {
        throw new Error("Không nhận được mã pallet từ server")
      }
      setPallet(prev => ({
        ...prev,
        ma_pallet: data.ma_pallet
      }))
    } catch (error) {
      console.error("Error fetching pallet code:", error)
      alert(`Không thể tạo mã pallet tự động: ${error.message}`)
    }
  }

  // Hàm lấy dữ liệu dropdown
  const fetchDropdownData = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/nhaphang/pallets/drop_down/")
      if (!response.ok) {
        throw new Error("Không thể tải dữ liệu dropdown")
      }
      const data = await response.json()
      setDropdownData(data)
    } catch (error) {
      console.error("Error fetching dropdown data:", error)
      alert(`Không thể tải dữ liệu: ${error.message}`)
    }
  }

  // Gọi API khi component được mount
  useEffect(() => {
    fetchNewPalletCode()
    fetchDropdownData()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    let processedValue = value

    // Xử lý kiểu dữ liệu cho từng trường
    switch (name) {
      case 'so_thung_ban_dau':
      case 'so_thung_con_lai':
        processedValue = value === '' ? '' : parseInt(value)
        break
      case 'san_pham':
      case 'nha_cung_cap':
      case 'vi_tri_kho':
        processedValue = value === '' ? '' : parseInt(value)
        break
      case 'ma_pallet':
        processedValue = value.slice(0, 20)
        break
      case 'trang_thai':
        processedValue = value.slice(0, 5)
        break
      default:
        processedValue = value
    }

    setPallet(prev => ({
      ...prev,
      [name]: processedValue
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!pallet.san_pham) {
      newErrors.san_pham = "Vui lòng chọn sản phẩm"
    }

    if (!pallet.so_thung_ban_dau || pallet.so_thung_ban_dau <= 0) {
      newErrors.so_thung_ban_dau = "Số thùng ban đầu phải là số nguyên dương"
    }

    if (!pallet.vi_tri_kho) {
      newErrors.vi_tri_kho = "Vui lòng chọn vị trí kho"
    }

    if (!pallet.ngay_san_xuat) {
      newErrors.ngay_san_xuat = "Vui lòng nhập ngày sản xuất"
    }

    if (!pallet.han_su_dung) {
      newErrors.han_su_dung = "Vui lòng nhập hạn sử dụng"
    }

    // Kiểm tra logic ngày tháng
    if (pallet.ngay_san_xuat && pallet.han_su_dung) {
      if (new Date(pallet.ngay_san_xuat) >= new Date(pallet.han_su_dung)) {
        newErrors.han_su_dung = "Hạn sử dụng phải sau ngày sản xuất"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const formData = {
        ma_pallet: pallet.ma_pallet,
        san_pham: parseInt(pallet.san_pham),
        nha_cung_cap: pallet.nha_cung_cap ? parseInt(pallet.nha_cung_cap) : null,
        so_thung_ban_dau: parseInt(pallet.so_thung_ban_dau),
        so_thung_con_lai: parseInt(pallet.so_thung_ban_dau), // Bằng số thùng ban đầu khi tạo mới
        vi_tri_kho: parseInt(pallet.vi_tri_kho),
        ngay_san_xuat: pallet.ngay_san_xuat,
        han_su_dung: pallet.han_su_dung,
        ngay_kiem_tra_cl: pallet.ngay_kiem_tra_cl,
        trang_thai: pallet.trang_thai,
        ghi_chu: pallet.ghi_chu || "",
      }

      console.log("Sending data:", formData)

      const response = await fetch("http://127.0.0.1:8000/nhaphang/pallets/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error Response:", errorData)

        // Xử lý lỗi validation từ serializer
        if (errorData.detail) {
          throw new Error(errorData.detail)
        } else if (typeof errorData === 'object') {
          const errorMessages = []
          for (const [field, messages] of Object.entries(errorData)) {
            if (Array.isArray(messages)) {
              errorMessages.push(`${field}: ${messages.join(', ')}`)
            } else {
              errorMessages.push(`${field}: ${messages}`)
            }
          }
          throw new Error(errorMessages.join('\n'))
        } else {
          throw new Error("Có lỗi xảy ra khi tạo pallet")
        }
      }

      const result = await response.json()
      alert("Tạo pallet thành công!")

      if (onSubmit) {
        onSubmit(result)
      }

      // Reset form và tạo mã pallet mới
      setPallet({
        ma_pallet: "",
        san_pham: "",
        nha_cung_cap: "",
        so_thung_ban_dau: "",
        so_thung_con_lai: "",
        vi_tri_kho: "",
        ngay_san_xuat: "",
        han_su_dung: "",
        ngay_kiem_tra_cl: new Date().toISOString().slice(0, 10),
        trang_thai: "Mới",
        ghi_chu: "",
      })
      setErrors({})

      // Tạo mã pallet mới cho lần nhập tiếp theo
      fetchNewPalletCode()

    } catch (error) {
      console.error("Error creating pallet:", error)
      alert(`Tạo pallet thất bại: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pallet-form">
      <div className="form-section">
        <h4 className="section-title">
          <Package size={16} />
          Thông tin cơ bản
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Mã Pallet</label>
            <input
              type="text"
              name="ma_pallet"
              className="form-input"
              value={pallet.ma_pallet}
              disabled
              placeholder="Sẽ được tạo tự động"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Sản phẩm *</label>
            <select
              name="san_pham"
              className={`form-input ${errors.san_pham ? "error" : ""}`}
              value={pallet.san_pham}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">-- Chọn sản phẩm --</option>
              {dropdownData.ds_san_pham.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.san_pham && <span className="error-text">{errors.san_pham}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Nhà cung cấp</label>
            <select
              name="nha_cung_cap"
              className="form-input"
              value={pallet.nha_cung_cap}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">-- Chọn nhà cung cấp (không bắt buộc) --</option>
              {dropdownData.ds_nha_cung_cap.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Số thùng ban đầu *</label>
            <input
              type="number"
              name="so_thung_ban_dau"
              className={`form-input ${errors.so_thung_ban_dau ? "error" : ""}`}
              value={pallet.so_thung_ban_dau}
              onChange={handleChange}
              placeholder="Nhập số thùng"
              min="1"
              disabled={loading}
            />
            {errors.so_thung_ban_dau && <span className="error-text">{errors.so_thung_ban_dau}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Trạng thái</label>
            <select
              name="trang_thai"
              className="form-input"
              value={pallet.trang_thai}
              onChange={handleChange}
              disabled={loading}
            >
              {trangThaiOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">
          <Calendar size={16} />
          Thông tin thời gian
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ngày sản xuất *</label>
            <input
              type="date"
              name="ngay_san_xuat"
              className={`form-input ${errors.ngay_san_xuat ? "error" : ""}`}
              value={pallet.ngay_san_xuat}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.ngay_san_xuat && <span className="error-text">{errors.ngay_san_xuat}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Hạn sử dụng *</label>
            <input
              type="date"
              name="han_su_dung"
              className={`form-input ${errors.han_su_dung ? "error" : ""}`}
              value={pallet.han_su_dung}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.han_su_dung && <span className="error-text">{errors.han_su_dung}</span>}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ngày kiểm tra CL</label>
            <input
              type="date"
              name="ngay_kiem_tra_cl"
              className="form-input"
              value={pallet.ngay_kiem_tra_cl}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h4 className="section-title">
          <MapPin size={16} />
          Vị trí kho
        </h4>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Vị trí kho *</label>
            <select
              name="vi_tri_kho"
              className={`form-input ${errors.vi_tri_kho ? "error" : ""}`}
              value={pallet.vi_tri_kho}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="">-- Chọn vị trí kho --</option>
              {dropdownData.ds_vi_tri_kho.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
            {errors.vi_tri_kho && <span className="error-text">{errors.vi_tri_kho}</span>}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú</label>
          <textarea
            name="ghi_chu"
            className="form-input"
            rows="3"
            value={pallet.ghi_chu}
            onChange={handleChange}
            placeholder="Nhập ghi chú về chất lượng, tình trạng sản phẩm..."
            disabled={loading}
          />
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel} disabled={loading}>
          Hủy
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Đang tạo..." : "Tạo Pallet"}
        </button>
      </div>
    </form>
  )
}

export default ThemPallet