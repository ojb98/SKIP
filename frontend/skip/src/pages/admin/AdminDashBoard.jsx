import React, { useState, useEffect } from "react";
import SalesSummaryChart from "../../components/adminpage/SalesSummaryChart";
import SalesCategoryChart from "../../components/adminpage/SalesCategoryChart";
import SalesTable from "../../components/adminpage/SalesTable";
import { fetchSalesSummary, fetchSalesChartData, fetchSalesList } from "../../services/admin/salesService";
import StatOverviewCard from "../../components/adminpage/StatOverviewCard";
import axios from "axios";
import Odometer from 'react-odometerjs'
import 'odometer/themes/odometer-theme-default.css'
import DateInput from "../../components/adminpage/DateInput";

const AdminDashboard = () => {
    const getToday = () => new Date().toISOString().split("T")[0];
    const getDayAgo = () => {
        const d = new Date();
        d.setDate(d.getDate() - 1);
        return d.toISOString().split("T")[0];
    }
    const getWeekAgo = () => {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        return d.toISOString().split("T")[0];
    };
    const getYearAgo = () => {
        const d = new Date();
        d.setDate(d.getDate() - 365);
        return d.toISOString().split("T")[0];
    }
    
    const [categoryData, setCategoryData] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [startDate, setStartDate] = useState(getWeekAgo());
    const [endDate, setEndDate] = useState(getToday());
    const [mounted, setMounted] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const getRelativeDate = (base, diffDays) => {
        const d = new Date(base)
        d.setDate(d.getDate() - diffDays)
        return d.toISOString().split("T")[0]
    }
    const [summaryData, setSummaryData] = useState({
        
        totalSales: 0,
        totalSalesCount: 0,
        totalProfit: 0,
        totalSuccessCount: 0,
        totalCancelCount: 0,
        totalCancelPrice: 0,
        totalRentPrice: 0,
        totalAdPrice: 0,
        totalAdCount: 0,
        // totalPendingCount: 0,
        totalAdAmount : 0,
        totalBannerWating : 0,
    });
    const [summaryTodaysData, setSummaryTodaysData] = useState({
        
        totalSales: 0,
        totalSalesCount: 0,
        totalProfit: 0,
        totalSuccessCount: 0,
        totalCancelCount: 0,
        totalCancelPrice: 0,
        totalRentPrice: 0,
        totalAdPrice: 0,
        totalAdCount: 0,
        // totalPendingCount: 0,
        totalAdAmount : 0,
        totalBannerWating : 0,
    });
    const [summaryDaysAgoData, setSummaryDaysAgoData] = useState({
        
        totalSales: 0,
        totalSalesCount: 0,
        totalProfit: 0,
        totalSuccessCount: 0,
        totalCancelCount: 0,
        totalCancelPrice: 0,
        totalRentPrice: 0,
        totalAdPrice: 0,
        totalAdCount: 0,
        // totalPendingCount: 0,
        totalAdAmount : 0,
        totalBannerWating : 0,
    });
    const [summaryWeeksAgoData, setSummaryWeeksAgoData] = useState({
        
        totalSales: 0,
        totalSalesCount: 0,
        totalProfit: 0,
        totalSuccessCount: 0,
        totalCancelCount: 0,
        totalCancelPrice: 0,
        totalRentPrice: 0,
        totalAdPrice: 0,
        totalAdCount: 0,
        // totalPendingCount: 0,
        totalAdAmount : 0,
        totalBannerWating : 0,
    });
    const [summaryYearsAgoData, setSummaryYearsAgoData] = useState({
        
        totalSales: 0,
        totalSalesCount: 0,
        totalProfit: 0,
        totalSuccessCount: 0,
        totalCancelCount: 0,
        totalCancelPrice: 0,
        totalRentPrice: 0,
        totalAdPrice: 0,
        totalAdCount: 0,
        // totalPendingCount: 0,
        totalAdAmount : 0,
        totalBannerWating : 0,
    });
    useEffect(() => {
        setMounted(true)
    }, [])
    
    useEffect(() => {
       loadDashboardData();
    }, [startDate, endDate]);

    const refreshData = () => {
        const newStart = getWeekAgo();
        const newEnd = getToday();

        setStartDate(newStart);
        setEndDate(newEnd);
    }
    const loadDashboardData = () => {
        const end = endDate;
        if (startDate && endDate) {
            axios.get(`/api/admin/summary?startDate=${startDate}&endDate=${endDate}`)
                .then(res => setSummaryData(res.data))
                .catch(err => console.error("요약 통계 불러오기 실패", err));
        }
        if (startDate && endDate) {
            axios.get(`/api/admin/today-sales-data?todaysDate=${end}`)
                .then(res => setSummaryTodaysData(res.data))
                .catch(err => console.error("요약 통계 불러오기 실패", err));
        }
        if (startDate && endDate) {
            axios.get(`/api/admin/today-sales-data?todaysDate=${getRelativeDate(end, 1)}`)
                .then(res => setSummaryDaysAgoData(res.data))
                .catch(err => console.error("요약 통계 불러오기 실패", err));
        }
        if (startDate && endDate) {
            axios.get(`/api/admin/today-sales-data?todaysDate=${getRelativeDate(end, 7)}`)
                .then(res => setSummaryWeeksAgoData(res.data))
                .catch(err => console.error("요약 통계 불러오기 실패", err));
        }
        if (startDate && endDate) {
            axios.get(`/api/admin/today-sales-data?todaysDate=${getRelativeDate(end, 365)}`)
                .then(res => setSummaryYearsAgoData(res.data))
                .catch(err => console.error("요약 통계 불러오기 실패", err));
        }
        
        fetchSalesChartData(startDate, endDate)
            .then(data => setCategoryData(data.categorySales))
            .catch(error => console.error("카테고리 데이터 로드 오류:", error));

        

        fetchSalesList(startDate, endDate)
            .then(data => setSalesList(data))
            .catch(error => console.error("매출 리스트 데이터 로드 오류:", error));
    };    

    const handleClick = (type) => {
        setIsClicked(type);
        setTimeout(() => setIsClicked(null), 150); 
        // 다운로드 기능 등도 여기에 추가
    };

    return (
        <div className="admin-dashboard">
            <h2>📊 통합 매출 관리</h2> 
            <div style={{display:"flex" ,marginTop:"10px"}}>
                <div className="date-card">
                    <h3>📅 조회일자 선택</h3>
                    <DateInput startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate}/>            
                </div>
                <div className="card-sales">
                    <h3>💰 총 매출</h3>
                    <div className="odometer">
                        <Odometer value={mounted ? summaryData.totalSales : 0} format="(,ddd)" duration={500} /> 원
                    </div>
                </div>

                <div className="card-sales">
                    <h3>💸 순 이익</h3>
                    <div className="odometer">
                        <Odometer value={mounted ? summaryData.totalProfit : 0} format="(,ddd)" duration={500} /> 원
                    </div>
                </div>

                <div className="card">
                    <h3>✅ 결제 완료</h3>
                    <div className="odometer">
                        <Odometer value={mounted ? summaryData.totalSuccessCount : 0} duration={500} /> 건
                    </div>
                </div>

                <div className="card">
                    <h3>❌ 결제 취소</h3>
                    <div className="odometer">
                        <Odometer value={mounted ? summaryData.totalCancelCount : 0} duration={500} /> 건
                    </div>
                </div>                   

                <div className="card">
                    <h3>⭐ 배너신청</h3>
                    <div id="confirmReservCard" className="odometer">
                        <Odometer value={mounted ? summaryData.totalBannerWating : 0} duration={500} /> 건
                    </div>
                </div>
                <div className="card-excel">                
                    <div style={{display:"flex",marginBottom:"10px", cursor: "pointer", backgroundColor: isClicked==="xlsx" ? "#ccc" : "transparent",transition: "background-color 0.2s ease", borderRadius:"4px"}} onClick={()=>{handleClick("xlsx")}}>
                        <img src="/public/icons8-msExcel-48.png" style={{width:"10%",height:"10%"}}/>
                        <h6>&nbsp;&nbsp;엑셀 파일로 내려받기 (.xlsx)</h6>
                    </div>
                    <div style={{display:"flex", cursor: "pointer", backgroundColor: isClicked==="cell" ? "#ccc" : "transparent", transition: "background-color 0.2s ease", borderRadius:"4px"}} onClick={()=>{handleClick("cell")}}>
                        <img src="/public/icon-hancell.png" style={{width:"10%",height:"9%"}}/>
                        <h6>&nbsp;&nbsp;한셀 파일로 내려받기 (.cell)</h6>
                    </div>
                </div>

                <div className="card-refresh" onClick={()=>{handleClick("refresh"); refreshData()}} style={{cursor:"pointer", backgroundColor: isClicked==="refresh" ? "#ccc" : "transparent"}}>
                    <img src="/public/icons8-refresh-60.png" style={{width:"60px"}}/>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <SalesSummaryChart summaryData={summaryData}/>
                <SalesCategoryChart categoryData={categoryData} />
                <StatOverviewCard 
                stats={{
                    current: summaryData,
                    today: summaryTodaysData,
                    dayAgo: summaryDaysAgoData,
                    weekAgo: summaryWeeksAgoData,
                    yearAgo: summaryYearsAgoData
                }} 
                />
            </div>
            {/* <SalesTable salesList={salesList} /> */}
        </div>
    );
};

export default AdminDashboard;
