import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const SalesCategoryChart = ({ categoryData }) => {
  const data = {
    labels: ["스키", "보드", "장비", "의류", ""],
    datasets: [
      {
        data: categoryData || [100, 200, 150, 250, 300],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)"
        ],
        borderWidth: 1,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
        boxWidth: 18,
        padding: 8,
        font: {
          size: 12
        }
        }
      }
    }
  };

  return (
    <div className="chart-card">
      <h3>🏂 상품별 매출 기여도 (건)</h3>
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default SalesCategoryChart;