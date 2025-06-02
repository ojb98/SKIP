import { useState } from "react";
import { Bar } from "react-chartjs-2";

const SalesSummaryChart = ({ summaryData }) => {
  const [mode,setMode] = useState("count");
  const toggleHandle = (type) => {
    setMode(type);
  };

  const data = {
    labels: mode === "count"? [["총 결제 (건)","(렌트+광고)"] , "결제완료", "결제취소",  "광고결제","광고신청", "렌탈샵결제"] 
                            : [["총 결제 (원)","(렌트+광고)"] , "총 환불", "광고 수익", "렌탈샵 매출", "순이익"],
    datasets: [
      {
        label: "매출 요약",
        data:

          mode === "count" ? [
              summaryData.totalSalesCount || 0,
              summaryData.totalSuccessCount || 0,
              summaryData.totalCancelCount || 0,           
              summaryData.totalAdCount || 0,
              summaryData.totalAdAmount || 0,
              summaryData.totalRentAmount || 0,                
            ]
            :[
          summaryData.totalSales || 0,
          summaryData.totalCancelPrice || 0,
          summaryData.totalAdPrice || 0,          
          summaryData.totalRentPrice || 0,
          summaryData.totalProfit || 0
        ],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        fill: true,
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => value.toLocaleString() +  (mode === "count" ? "건":"원"),
        },
      },
    },
  };

  return (
    
    <div className="chart-card1">      
      <div className="chart-card1-header">
        <h3>📈 매출 요약</h3>
        <div className="btn-group">
          <button className={`toggle-btn ${mode === "count" ? "active" : ""}`} onClick={() => toggleHandle("count")}>결제건수</button>
          <button className={`toggle-btn ${mode === "amount" ? "active" : ""}`} onClick={() => toggleHandle("amount")}>결제금액</button>          
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesSummaryChart;
