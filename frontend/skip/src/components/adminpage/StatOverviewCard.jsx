import { useState } from "react"

const StatOverviewCard = ({ stats }) => {
  const [mode, setMode] = useState("count")

  const trendIcon = value => (value > 0 ? "▲" : value < 0 ? "▼" : "-")

  const safeGet = (obj, key) => (obj && typeof obj[key] === "number" ? obj[key] : 0)

  // 예외 방지: stats 구조 없으면 로딩 중
  if (!stats || !stats.today || !stats.dayAgo) {
    return <div>📈 통계 데이터를 불러오는 중입니다...</div>
  }

  const current = stats.current
  const before = stats.before
  const today = stats.today
  const dayAgo = stats.dayAgo
  const weekAgo = stats.weekAgo
  const yearAgo = stats.yearAgo
  
  const compareSections = [
    {
      label: "전일 대비",
      ref: dayAgo
    },
    {
      label: "전주 대비",
      ref: weekAgo
    },
    {
      label: "전년도 대비",
      ref: yearAgo
    }
  ]

  const calcChange = (now, prev) => {
    if (!prev || prev === 0) return 0
    return ((now - prev) / prev) * 100
  }

  return (
    <div className="stat-overview-card">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>📌 통계 요약</h3>
        <div className="btn-group">
          <button
            className={`toggle-btn ${mode === "count" ? "active" : ""}`}
            onClick={() => setMode("count")}
          >
            선택일자
          </button>
          <button
            className={`toggle-btn ${mode === "amount" ? "active" : ""}`}
            onClick={() => setMode("amount")}
          >
            오늘날짜
          </button>
        </div>
      </div>

      <ul>
        {mode === "amount" ? (
          compareSections.map((section, idx) => {
            const { label, ref } = section

            const sales = safeGet(ref, "totalSales")
            const count = safeGet(ref, "totalSalesCount")
            const ad = safeGet(ref, "totalAdPrice")

            const salesChange = calcChange(safeGet(today, "totalSales"), sales)
            const countChange = calcChange(safeGet(today, "totalSalesCount"), count)
            const adChange = calcChange(safeGet(today, "totalAdPrice"), ad)
            const salesFontColor = salesChange >= 0 ? "red" : "blue";
            const countFontColor = countChange >= 0 ? "red" : "blue";
            const adFontColor = adChange >= 0 ? "red" : "blue";
            return (
              <li
                key={label}
                style={{
                  borderTop: idx > 0 ? "1px solid #ccc" : "none",
                  marginTop: idx > 0 ? "15px" : "0",
                  paddingTop: "10px",
                  listStyle: "none"
                }}
              >
                <div style={{ marginBottom: "1px" }}>
                  {label} 매출: <span style={{color:salesFontColor}}><strong>{sales.toLocaleString()}원</strong> (
                  {trendIcon(salesChange)} {Math.abs(salesChange).toFixed(1)}%)</span>
                </div>
                <div style={{ marginBottom: "1px" }}>
                  결제 건수: <span style={{color:countFontColor}}><strong>{count.toLocaleString()}건</strong> (
                  {trendIcon(countChange)} {Math.abs(countChange).toFixed(1)}%)</span>
                </div>
                <div>
                  광고 수익: <span style={{color:adFontColor}}><strong>{ad.toLocaleString()}원</strong> (
                  {trendIcon(adChange)} {Math.abs(adChange).toFixed(1)}%)</span>
                </div>
              </li>
            )
          })
        ) : (
          <li style={{ padding: "10px 0", listStyle: "none" }}>
            선택일자 기반 통계
          </li>
        )}
      </ul>
    </div>
  )
}

export default StatOverviewCard
