import React, { useState, useEffect } from "react";
import SalesSummaryChart from "../../components/adminpage/SalesSummaryChart";
import SalesCategoryChart from "../../components/adminpage/SalesCategoryChart";
import SalesTable from "../../components/adminpage/SalesTable";
import { fetchSalesSummary, fetchSalesChartData, fetchSalesList } from "../../services/admin/salesService";
import "../../styles/admin/admin.css";

const AdminDashboard = () => {
    const [summaryData, setSummaryData] = useState({});
    const [categoryData, setCategoryData] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(() => {
        // 요약 데이터 로드
        fetchSalesSummary(startDate, endDate)
            .then(data => setSummaryData(data))
            .catch(error => console.error("요약 데이터 로드 오류:", error));

        // 카테고리 데이터 로드
        fetchSalesChartData(startDate, endDate)
            .then(data => setCategoryData(data.categorySales))
            .catch(error => console.error("카테고리 데이터 로드 오류:", error));

        // 매출 리스트 로드
        fetchSalesList(startDate, endDate)
            .then(data => setSalesList(data))
            .catch(error => console.error("매출 리스트 데이터 로드 오류:", error));
    }, [startDate, endDate]);

    return (
        <div className="admin-dashboard">
            <h2>📊 통합 매출 관리</h2>
            <div style={{display:"flex"}}>
                <div className="date-card">
                    <h3>📅 조회일자 선택</h3>
                    <div className="date-input-group">
                        <div className="date-item">
                            <label>시작 날짜</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        <div className="date-item">
                            <label>종료 날짜</label>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </div>                
                </div>
                <div className="card">
                    <h3>💰 총 매출</h3>
                    <p id="totalSaleCard" class="odometer"></p>원
                </div>
                
                <div className="card">
                    <h3>✅ 완료된 예약</h3>
                    <p id="confirmReservCard" class="odometer"></p>건
                </div>
            </div>
            <div style={{display:"flex"}}>
                <SalesSummaryChart summaryData={summaryData}/>
                <SalesCategoryChart categoryData={categoryData} />
            </div>
            <SalesTable salesList={salesList} />
        </div>
    );
};

export default AdminDashboard;
