import React from "react";
import { Bar } from "react-chartjs-2";

const SalesSummaryChart = ({ summaryData }) => {
  const data = {
    labels: ["총 결제", "총 환불", "총 광고 결제", "관리자 수익", "렌탈샵 수익", "순이익"],
    datasets: [
      {
        label: "매출 요약",
        data: [
          summaryData.totalSales || 0,
          summaryData.totalRefund || 0,
          summaryData.totalAdPayment || 0,
          summaryData.totalAdminEarnings || 0,
          summaryData.totalRentEarnings || 0,
          (summaryData.totalSales || 0) - (summaryData.totalRefund || 0)
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
          callback: (value) => value.toLocaleString() + "원",
        },
      },
    },
  };

  return (
    <div className="chart-card1">
      <div className="chart-card1-header">
        <h3>📈 매출 요약</h3>
        <div className="btn-group">
          <button className="toggle-btn active">결제건수</button>
          <button className="toggle-btn">결제금액</button>
        </div>
      </div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default SalesSummaryChart;
