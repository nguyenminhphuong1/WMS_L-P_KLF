"use client"

import React, { useState, useRef } from "react";

const InQRPallet = ({ pallets }) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showQRForm, setShowQRForm] = useState(false);

  const getQrUrl = (pallet) => {
    const palletData = encodeURIComponent(JSON.stringify(pallet));
    // Lấy host và port hiện tại từ window.location
    const { protocol, hostname, port } = window.location;
    const baseUrl = `${protocol}//${hostname}${port ? `:${port}` : ""}`;
    const link = `${baseUrl}/nhap-hang/scan?data=${palletData}`;
    return `http://localhost:8000/nhaphang/pallets/qr/?data=${encodeURIComponent(link)}`;
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(pallets.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleCreateQR = () => {
    setShowQRForm(true);
  };

  const selectedPallets = pallets.filter((p) => selectedIds.includes(p.id));

  // Bước 1: Chọn pallet
  if (!showQRForm) {
    return (
      <div>
        <h4>Chọn pallet muốn tạo QR</h4>
        <div style={{ marginBottom: 16 }}>
          <label>
            <input
              type="checkbox"
              checked={selectedIds.length === pallets.length && pallets.length > 0}
              onChange={handleSelectAll}
            />{" "}
            Chọn tất cả
          </label>
        </div>
        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 24, border: "1px solid #eee", padding: 8 }}>
          {pallets.map((pallet) => (
            <label key={pallet.id} style={{ display: "block", marginBottom: 4 }}>
              <input
                type="checkbox"
                checked={selectedIds.includes(pallet.id)}
                onChange={() => handleCheckboxChange(pallet.id)}
              />{" "}
              {pallet.ma_pallet} - {pallet.ten_san_pham}
            </label>
          ))}
        </div>
        <button
          className="btn btn-primary"
          disabled={selectedIds.length === 0}
          onClick={handleCreateQR}
        >
          Tạo QR
        </button>
      </div>
    );
  }

  // Bước 2: Hiển thị QR các pallet đã chọn
  return (
    <div>
      <h4>Danh sách QR Pallet đã chọn</h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(1fr)",
          gap: "24px",
        }}
      >
        {selectedPallets.map((pallet) => (
          <div
            key={pallet.id}
            style={{
              border: "1px solid #ccc",
              padding: "16px",
              textAlign: "center",
              background: "#fff",
            }}
            className="qr-print-area"
          >
            <div>
              <img
                src={getQrUrl(pallet)}
                alt={`QR ${pallet.ma_pallet}`}
                style={{ width: 350, height: 350 }}
              />
            </div>
            <div style={{ marginTop: 8 }}>
              <strong>{pallet.ma_pallet}</strong>
              <div>{pallet.ten_san_pham}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        style={{ marginTop: 32 }}
        onClick={() => window.print()}
        className="btn btn-primary"
      >
        In QR
      </button>
    </div>
  );
};

export default InQRPallet;