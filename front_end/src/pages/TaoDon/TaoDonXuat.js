"use client"

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Plus, Save, Trash2, Calculator, Package } from "lucide-react"
import Modal from "../../components/common/Modal"
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DEFAULT_FORM_ORDER = {
  ma_don: "",
  cua_hang: "",
  ngay_tao: new Date().toISOString().slice(0, 10),
  ngay_giao: new Date().toISOString().slice(0, 10),
  trang_thai: "Chờ_xuất",
  qr_code_data: "",
  da_in_qr: false,
  nguoi_tao: "",
  ghi_chu: "",
}

const DEFAULT_FORM_DETAIL = {
  don_xuat: "",
  san_pham: "",
  so_luong_can: 0,
  pallet_assignments: {},
  trang_thai: "Chờ_xuất",
  da_xuat_xong: false,
  ghi_chu: "",
}

const TaoDonXuat = () => {
  const [orders, setOrders] = useState([])
  const [formOrder, setFormOrders] = useState(DEFAULT_FORM_ORDER)
  const [details, setDetails] = useState([])
  const [formDetail, setFormDetail] = useState(DEFAULT_FORM_DETAIL)
  const [cuaHang, setCuaHang] = useState([])
  const [errors, setErrors] = useState({})
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedproduct] = useState([])

  const newItem = {
    temp_id: Date.now(), 
    san_pham: "",
    so_luong_can: "",
    pallet_assignments: "",
    trang_thai: "Chờ_xuất",
    da_xuat_xong: false,
    ghi_chu: "",
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/taodon/donxuat/", formOrder);

      const createdOrderId = res.data.id; 

      await Promise.all(
        selectedProducts.map((item) =>
          axios.post("http://localhost:8000/taodon/chitietdon/", {
            don_xuat: createdOrderId, 
            san_pham: item.san_pham,
            so_luong_can: item.so_luong,
            pallet_assignments: item.pallet_assignments || [],
            trang_thai: "Chờ_xuất",
            da_xuat_xong: false,
            ghi_chu: item.ghi_chu || "",
          })
        )
      );

      toast.success("Thêm đơn xuất thành công!");
      setFormOrders(DEFAULT_FORM_ORDER);
      setSelectedproduct([]);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi tạo đơn xuất hoặc chi tiết đơn!");
    }
  };


  const addOrderItem = () => {
    const newItem = {
      id: Date.now(),
      productCode: "",
      productName: "",
      quantity: "",
      unit: "",
      notes: "",
      allocation: null,
    }
    setSelectedproduct([...selectedProducts, newItem])
  }

  //fetch data của hàng
  const loaded = useRef(false);
  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    axios.get('http://localhost:8000/taodon/cuahang') 
      .then((res) => {
        setCuaHang(res.data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu cửa hàng: ', err);
      });
  }, []);

  //fetch data sản phẩm
  const loadedProduct = useRef(false);
  useEffect(() => {
    if (loadedProduct.current) return;
    loadedProduct.current = true;
    axios.get('http://localhost:8000/quanlykho/sanpham') 
      .then((res) => {
        setProducts(res.data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải dữ liệu cửa hàng: ', err);
      });
  }, []);

  const removeOrderItem = (id) => {
    setSelectedproduct(selectedProducts.filter((item) => item.id !== id))
  }

  const updateOrderItem = (id, updatedValues) => {
    setSelectedproduct((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, ...updatedValues } : item
      )
    );
  };

  return (
    <div className="tao-don-xuat">
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Order Info */}
      <div className="order-info card">
        <div className="card-header">
          <h3 className="card-title">Thông tin đơn hàng</h3>
        </div>
        <div className="card-body">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Mã đơn *</label>
              <input
                type="text"
                className={`form-input ${errors.ma_don ? "error" : ""}`}
                name="ma_don"
                value={formOrder.ma_don}
                onChange={(e) => setFormOrders({ ...formOrder, ma_don: e.target.value })}
                required
              />
              {errors.ma_don && <span className="error-text">{errors.ma_don}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Cửa hàng *</label>
              <select
                  name="cua_hang"
                  className={`form-input ${errors.cua_hang ? "error" : ""}`}
                  value={formOrder.cua_hang}
                  onChange={(e) => setFormOrders({ ...formOrder, cua_hang: e.target.value })}
                  required
                >
                  <option value="">-- Chọn cửa hàng --</option>
                  {cuaHang.map((ch) => (
                    <option key={ch.id} value={ch.id}>{ch.ma_cua_hang} - {ch.dia_chi_chi_tiet}</option>
                  ))}
              </select>
              {errors.cua_hang && <span className="error-text">{errors.cua_hang}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Ngày giao *</label>
              <input
                type="date"
                className={`form-input ${errors.ngay_giao ? "error" : ""}`}
                name="ngay_giao"
                value={formOrder.ngay_giao?.slice(0, 10) || ""}
                onChange={(e) => setFormOrders({ ...formOrder, ngay_giao: e.target.value })}
                required
              />
              {errors.ngay_giao && <span className="error-text">{errors.ngay_giao}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Người tạo</label>
              <input
                type="text"
                className={`form-input ${errors.nguoi_tao ? "error" : ""}`}
                name="nguoi_tao"
                value={formOrder.nguoi_tao}
                onChange={(e) => setFormOrders({ ...formOrder, nguoi_tao: e.target.value })}
              />
              {errors.nguoi_tao && <span className="error-text">{errors.nguoi_tao}</span>}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea
              className={`form-input ${errors.ghi_chu ? "error" : ""}`}
              rows="2"
              name="ghi_chu"
              value={formOrder.ghi_chu}
              onChange={(e) => setFormOrders({ ...formOrder, ghi_chu: e.target.value })}
              placeholder="Nhập ghi chú cho đơn hàng..."
            />
            {errors.ghi_chu && <span className="error-text">{errors.ghi_chu}</span>}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="order-items card">
        <div className="card-header">
          <h3 className="card-title">Danh sách sản phẩm</h3>
          <button className="btn btn-secondary" onClick={addOrderItem}>
            <Plus size={16} />
            Thêm sản phẩm
          </button>
        </div>
        <div className="card-body">
          <div className="excel-table">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: "245px" }}>Sản phẩm</th>
                  <th style={{ width: "245px" }}>Số lượng</th>
                  <th style={{ width: "245px" }}>Danh sách pallet</th>
                  <th style={{ width: "245px" }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {selectedProducts.map((item) => (
                  <tr key={item.id}>
                    <td>      
                      <select                                            
                        name="san_pham"
                        className={`table-input ${errors.san_pham ? "error" : ""}`}
                        value={item.san_pham}
                        onChange={(e) => updateOrderItem(item.id, { san_pham: e.target.value })}
                        required
                      >
                        <option value="">-- Chọn sản phẩm --</option>
                        {products.map((sp) => (
                          <option key={sp.id} value={sp.id}>{sp.ma_san_pham} - {sp.ten_san_pham}</option>
                        ))}
                    </select>
                    {errors.san_pham && <span className="error-text">{errors.san_pham}</span>}
                    </td>
                    <td>
                      <input
                        type="text"
                        className={`table-input ${errors.so_luong ? "error" : ""}`}
                        name="so_luong"
                        value={item.so_luong}
                        onChange={(e) => updateOrderItem(item.id, { so_luong: e.target.value })}
                        required
                      />
                      {errors.so_luong && <span className="error-text">{errors.so_luong}</span>}
                    </td>
                    <td>
                      <input
                        type="text"
                        className={`table-input ${errors.pallet_assignments ? "error" : ""}`}
                        name="so_luong"
                        value={item.pallet_assignments}
                        onChange={(e) => updateOrderItem(item.id, { pallet_assignments: e.target.value })}
                        required
                      />
                      {errors.pallet_assignments && <span className="error-text">{errors.pallet_assignments}</span>}
                    </td>

                    <td>
                      <button className="btn-action delete" onClick={() => removeOrderItem(item.id)} title="Xóa">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
                {selectedProducts.length === 0 && (
                  <tr>
                    <td colSpan="7" className="empty-row">
                      <div className="empty-state">
                        <Package size={48} />
                        <p>Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để bắt đầu.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button className="btn btn-primary" onClick={handleSubmitOrder}>
        XUẤT ĐƠN
      </button>
    </div>

  );

}

export default TaoDonXuat
