"use client"
import { Package, MapPin, Calendar, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

const ChiTietDonXuat = ({ donXuatId, onClose }) => {
  const [chiTietList, setChiTietList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChiTietDon = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/taodon/chitietdon/?don_xuat=${donXuatId}`);
        setChiTietList(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết đơn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChiTietDon();
  }, [donXuatId]);

  return (
    <div className="chi-tiet-don-xuat">
      <div className="detail-header">
        {chiTietList.length === 0 ? (
          <p>Không có dữ liệu chi tiết đơn hàng.</p>
        ) : (
          chiTietList.map((item, index) => (
            <div className="order-info" key={item.id || index}>
              <div className="pallet-list">
                {item.pallet_assignments.map((pallet, index) => (
                  <div key={pallet.id}>
                    <div>
                      <h2 className="order-code">🔗 {pallet.ma_pallet} </h2>
                    </div>
                    <div className="order-meta"><strong>Sản phẩm: {item.ten_san_pham}</strong></div>
                  🚚 {pallet.so_thung} thùng
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Actions */}
      <div className="detail-actions">
        <button className="btn btn-secondary" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  )
}

export default ChiTietDonXuat
