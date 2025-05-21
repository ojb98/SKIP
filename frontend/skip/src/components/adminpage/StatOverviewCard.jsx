// src/components/adminpage/StatOverviewCard.jsx
const StatOverviewCard = ({ stats }) => {
  return (
    <div className="stat-overview-card">
      <h3>📌 통계 요약</h3>
      <ul>
        <li>전일 대비 매출: <strong>{stats.sales.toLocaleString()}원</strong> ({stats.salesChange > 0 ? "▲" : "▼"} {Math.abs(stats.salesChange)}%)</li>
        <li>예약 건수: <strong>{stats.reservCount}건</strong> ({stats.reservChange > 0 ? "▲" : "▼"} {Math.abs(stats.reservChange)}%)</li>
        <li>광고 수익: <strong>{stats.adRevenue.toLocaleString()}원</strong> ({stats.adChange > 0 ? "▲" : "▼"} {Math.abs(stats.adChange)}%)</li>
      </ul>
    </div>
  );
};

export default StatOverviewCard;