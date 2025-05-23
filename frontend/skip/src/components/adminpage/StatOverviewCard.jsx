import { useState } from "react";

// src/components/adminpage/StatOverviewCard.jsx
const StatOverviewCard = ({ stats }) => {

  const [mode,setMode] = useState("count");
  
    const toggleHandle = (type) => {
      setMode(type);
    };

  return (
    <div className="stat-overview-card">
      <div style={{display:"flex", justifyContent: "space-between"}}>
        <h3>📌 통계 요약 </h3>
        <div className="btn-group">
          <button className={`toggle-btn ${mode === "count" ? "active" : ""}`} onClick={() => toggleHandle("count")}>선택일자</button>
          <button className={`toggle-btn ${mode === "amount" ? "active" : ""}`} onClick={() => toggleHandle("amount")}>오늘날짜</button>
        </div>
      </div>
      <ul>
        <div>
          <li>전일 대비 매출: <strong>{stats.sales.toLocaleString()}원</strong> ({stats.salesChange > 0 ? "▲" : "▼"} {Math.abs(stats.salesChange)}%)</li>
          <li>예약 건수: <strong>{stats.reservCount}건</strong> ({stats.reservChange > 0 ? "▲" : "▼"} {Math.abs(stats.reservChange)}%)</li>
          <li>광고 수익: <strong>{stats.adRevenue.toLocaleString()}원</strong> ({stats.adChange > 0 ? "▲" : "▼"} {Math.abs(stats.adChange)}%)</li>
        </div>
        <div style={{borderTop:"1px solid #b3b3b3", marginTop:"15px"}}>
          <li style={{ marginTop:"15px"}}>전월 대비 매출: <strong>{stats.sales.toLocaleString()}원</strong> ({stats.salesChange > 0 ? "▲" : "▼"} {Math.abs(stats.salesChange)}%)</li>
          <li>예약 건수: <strong>{stats.reservCount}건</strong> ({stats.reservChange > 0 ? "▲" : "▼"} {Math.abs(stats.reservChange)}%)</li>
          <li>광고 수익: <strong>{stats.adRevenue.toLocaleString()}원</strong> ({stats.adChange > 0 ? "▲" : "▼"} {Math.abs(stats.adChange)}%)</li>
        </div>
        <div style={{borderTop:"1px solid #b3b3b3",  marginTop:"15px"}}>
          <li style={{ marginTop:"15px"}}>전년도 대비 매출: <strong>{stats.sales.toLocaleString()}원</strong> ({stats.salesChange > 0 ? "▲" : "▼"} {Math.abs(stats.salesChange)}%)</li>
          <li>예약 건수: <strong>{stats.reservCount}건</strong> ({stats.reservChange > 0 ? "▲" : "▼"} {Math.abs(stats.reservChange)}%)</li>
          <li>광고 수익: <strong>{stats.adRevenue.toLocaleString()}원</strong> ({stats.adChange > 0 ? "▲" : "▼"} {Math.abs(stats.adChange)}%)</li>
        </div>

      </ul>
    </div>
  );
};

export default StatOverviewCard;