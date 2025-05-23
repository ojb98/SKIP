import React, { useState, useEffect } from "react";
import SalesSummaryChart from "../../components/adminpage/SalesSummaryChart";
import SalesCategoryChart from "../../components/adminpage/SalesCategoryChart";
import SalesTable from "../../components/adminpage/SalesTable";
import { fetchSalesSummary, fetchSalesChartData, fetchSalesList } from "../../services/admin/salesService";
import StatOverviewCard from "../../components/adminpage/StatOverviewCard";
import axios from "axios";
import Odometer from 'react-odometerjs'
import 'odometer/themes/odometer-theme-default.css'

const AdminDashboard = () => {
    
    const [categoryData, setCategoryData] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [mounted, setMounted] = useState(false)
    const [summaryData, setSummaryData] = useState({
        
        totalSales: 0,
        netProfit: 0,
        successCount: 0,
        cancelCount: 0
    });
    
    const dummyStats = {
        sales: 1520000,
        salesChange: 12.5,
        reservCount: 134,
        reservChange: -3.2,
        adRevenue: 450000,
        adChange: 5.8,
    };
    useEffect(() => {
        setMounted(true)
    }, [])
    
    useEffect(() => {
        if (startDate && endDate) {
            axios.get(`/api/admin/summary?startDate=${startDate}&endDate=${endDate}`)
            .then(res => setSummaryData(res.data))
            .catch(err => console.error("요약 통계 불러오기 실패", err));
        }        
        // 카테고리 데이터 로드
        fetchSalesChartData(startDate, endDate)
            .then(data => setCategoryData(data.categorySales))
            .catch(error => console.error("카테고리 데이터 로드 오류:", error));

        // 매출 리스트 로드
        fetchSalesList(startDate, endDate)
            .then(data => setSalesList(data))
            .catch(error => console.error("매출 리스트 데이터 로드 오류:", error));
    }, [startDate, endDate]);

    const handleRefresh = () => {
        fetchSalesSummary(startDate, endDate).then(setSummaryData);
        fetchSalesChartData(startDate, endDate).then(res => setCategoryData(res.categorySales));
        fetchSalesList(startDate, endDate).then(setSalesList);
    };

    return (
        <div className="admin-dashboard">
            <h2>📊 통합 매출 관리</h2> 
            <div style={{display:"flex" ,marginTop:"10px"}}>
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
                <div className="card-sales">
                    <h3>💰 총 매출</h3>
                    <p className="odometer">
                        <Odometer value={mounted ? summaryData.totalSales : 0} format="(,ddd)" duration={300} /> 원
                    </p>
                </div>

                <div className="card-sales">
                    <h3>💸 순 이익</h3>
                    <p className="odometer">
                        <Odometer value={mounted ? summaryData.netProfit : 0} format="(,ddd)" duration={300} /> 원
                    </p>
                </div>

                <div className="card">
                    <h3>✅ 결제 완료</h3>
                    <p className="odometer">
                        <Odometer value={mounted ? summaryData.successCount : 0} duration={300} /> 건
                    </p>
                </div>

                <div className="card">
                    <h3>❌ 결제 취소</h3>
                    <p className="odometer">
                        <Odometer value={mounted ? summaryData.cancelCount : 0} duration={300} /> 건
                    </p>
                </div>                   

                <div className="card">
                    <h3>⭐ 배너신청</h3>
                    <p id="confirmReservCard" className="odometer">
                        <Odometer value={mounted ? summaryData.cancelCount : 0} duration={1000} /> 건
                    </p>
                </div>
                <div className="card-excel">                
                    <div style={{display:"flex" , marginBottom:"12px"}}>
                        <img src="/public/icons8-msExcel-48.png" style={{width:"10%",height:"10%"}}/>
                        <h6>&nbsp;&nbsp;엑셀 파일로 내려받기 (.xlsx)</h6>
                    </div>
                    <div style={{display:"flex"}}>
                        <img src="/public/icon-hancell.png" style={{width:"10%",height:"9%"}}/>
                        <h6>&nbsp;&nbsp;한셀 파일로 내려받기 (.cell)</h6>
                    </div>
                </div>

                <div className="card-refresh" onClick={handleRefresh} style={{cursor:"pointer"}}>
                    <img src="/public/icons8-refresh-60.png" />
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <SalesSummaryChart summaryData={summaryData}/>
                <SalesCategoryChart categoryData={categoryData} />
                <StatOverviewCard stats={dummyStats} />
            </div>
            <SalesTable salesList={salesList} />
        </div>
    );
};

export default AdminDashboard;
