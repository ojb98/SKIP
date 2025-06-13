import { useState } from "react"
import { Bar } from "react-chartjs-2";

const StatOverviewCard = ({ stats }) => {
  const [mode, setMode] = useState("count");
  const [mode1, setMode1] = useState("count1");

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
  const toggleHandle = (type) => {
    setMode(type);
  };
  const toggleHandle1 = (type) => {
    setMode1(type);
  };

  const data = {
    labels: mode1 === "count1"? [["총 결제 (건)","(렌트+광고)"] , "결제완료", "결제취소",  "광고결제","광고신청", "렌탈샵결제"] 
                            : [["총 결제 (원)","(렌트+광고)"] , "총 환불", "광고 수익", "렌탈샵 매출", ["SKI:P","순이익"]],
    datasets: [
      {
        label: "이전 기간",
        data:

          mode1 === "count1" ? [
              before.totalSalesCount || 0,
              before.totalSuccessCount || 0,
              before.totalCancelCount || 0,           
              before.totalAdCount || 0,
              before.totalAdAmount || 0,
              before.totalRentAmount || 0,                
            ]
            :[
          before.totalSales || 0,
          before.totalCancelPrice || 0,
          before.totalAdPrice || 0,          
          before.totalRentPrice || 0,
          before.totalProfit || 0
        ],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: true,
      },{
        label: "현재 기간",
        data:

          mode1 === "count1" ? [
              current.totalSalesCount || 0,
              current.totalSuccessCount || 0,
              current.totalCancelCount || 0,           
              current.totalAdCount || 0,
              current.totalAdAmount || 0,
              current.totalRentAmount || 0,                
            ]
            :[
          current.totalSales || 0,
          current.totalCancelPrice || 0,
          current.totalAdPrice || 0,          
          current.totalRentPrice || 0,
          current.totalProfit || 0
        ],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        fill: true,
      }
    ],
  };
  const options = {
    indexAxis: 'y',
    responsive: true,
     maintainAspectRatio: false, 
    plugins: {
      legend: { display: true },
    },  
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString() +  (mode === "count" ? "건":"원"),
        },
      },
    },
  };


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
          <div className="chart-card2" style={{alignContent:"center"}}>     
            <div className="chart-card2-header">
              <div className="btn-group">
                <button className={`toggle-btn ${mode1 === "count1" ? "active" : ""}`} onClick={() => toggleHandle1("count1")} style={{padding:"2px", height:"25px"}}>건수비교</button>
                <button className={`toggle-btn ${mode1 === "amount1" ? "active" : ""}`} onClick={() => toggleHandle1("amount1")} style={{padding:"2px", height:"25px"}}>금액비교</button>          
              </div>
            </div> 
            <div style={{ height: "310px" }}>
            <Bar
              data={data}
              options={options}
            />            
            </div>
          </div>
        )}
      </ul>
    </div>
  )
}

export default StatOverviewCard
