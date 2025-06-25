import React from "react";
import { useLocation } from "react-router-dom";
import ChiTietPallet from "./ChiTietPallet";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const HienThiQR = () => {
  const query = useQuery();
  const data = query.get("data");

  if (!data) {
    return <div>Không có thông tin pallet trong QR!</div>;
  }

  let pallet = null;
  try {
    pallet = JSON.parse(decodeURIComponent(data));
  } catch {
    return <div>Dữ liệu pallet trong QR không hợp lệ!</div>;
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", background: "#fff", borderRadius: 8, boxShadow: "0 2px 12px #eee", padding: 32 }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>Chi tiết Pallet</h2>
      <ChiTietPallet
        pallet={pallet}
        onClose={() => {}}
        onUpdate={() => {}}
      />
    </div>
  );
};

export default HienThiQR;