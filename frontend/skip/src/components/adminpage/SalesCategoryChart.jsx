import { Chart, registerables } from "chart.js";
import { Doughnut } from "react-chartjs-2";

Chart.register(...registerables);

const SalesCategoryChart = ({ categoryData }) => {
  const labels = ["LIFT_TICKET", "PACKAGE", "SKI", "SNOWBOARD", "PROTECTIVE_GEAR", "TOP", "BOTTOM", "SHOES"];
  const labelNames = ["리프트권", "패키지", "스키", "보드", "보호구", "상의", "하의", "신발"];
  console.log(categoryData);
  const counts = labels.map(label => {
    const found = categoryData.find(item => item.category === label);
    return found ? found.count : 0;
  });
  

  const data = {
    labels: labelNames,
    datasets: [
      {
        data: counts,
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 99, 132, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
          "rgba(100, 181, 246, 0.6)",
          "rgba(201, 203, 207, 0.6)"
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
          "rgba(100, 181, 246, 1)",
          "rgba(201, 203, 207, 1)"
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
      {categoryData && categoryData.length > 0 ? (
        <Doughnut data={data} options={options} />
      ) : ( 
        <p>📉 데이터가 없습니다.</p>
      )}
    </div>
  );
};
export default SalesCategoryChart;