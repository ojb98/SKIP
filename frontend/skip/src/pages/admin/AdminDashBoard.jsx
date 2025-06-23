import { useState, useEffect } from "react";
import { fetchDaySalesSummary,fetchSalesSummary, fetchSalesChartData, fetchSalesList } from "../../services/admin/salesService";
import SalesSummaryChart from "../../components/adminpage/SalesSummaryChart";
import SalesCategoryChart from "../../components/adminpage/SalesCategoryChart";
import StatOverviewCard from "../../components/adminpage/StatOverviewCard";
import Odometer from 'react-odometerjs';
import DateInput from "../../components/adminpage/DateInput";
import 'odometer/themes/odometer-theme-default.css';


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
    }

    const getYearAgo = () => {
        const d = new Date();
        d.setDate(d.getDate() - 365);
        return d.toISOString().split("T")[0];
    }

    // const getBeforeStart = (startDate) => {
    //     const d = new Date();
    //     d.setDate(startDate);
    //     return d.toISOString().split("T")[0];
    // }

    // const getBeforeEnd = (endDate) => {
    //     const d = new Date();
    //     d.setDate(endDate);
    //     return d.toISOString().split("T")[0];
    // }

    const getRelativeDate = (base, diffDays) => {
        const d = new Date(base)
        d.setDate(d.getDate() - diffDays)
        return d.toISOString().split("T")[0]
    }    

    const calcComparisonRange = (startStr, endStr) => {
    const start = new Date(startStr);
    const end = new Date(endStr);

    const diffInDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

    let beforeEnd = new Date(start);
    beforeEnd.setDate(beforeEnd.getDate() - 1);
    beforeEnd = beforeEnd.toISOString().split("T")[0];

    let beforeStart = new Date(beforeEnd);
    beforeStart.setDate(beforeStart.getDate() - diffInDays);
    beforeStart = beforeStart.toISOString().split("T")[0];

    return {
        beforeStartDate: beforeStart,
        beforeEndDate: beforeEnd,
    };
};
    const [categoryData, setCategoryData] = useState([]);
    const [salesList, setSalesList] = useState([]);
    const [startDate, setStartDate] = useState(getWeekAgo());
    const [endDate, setEndDate] = useState(getToday());
    const [mounted, setMounted] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [beforeStartDate, setBeforeStartDate] = useState();
    const [beforeEndDate, setBeforeEndDate] = useState();
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
        totalAdAmount : 0,
        totalBannerWating : 0,
    });
    const [beforeSummaryData, setBeforeSummaryData] = useState({        
        totalSales: 0,
        totalSalesCount: 0,
        totalProfit: 0,
        totalSuccessCount: 0,
        totalCancelCount: 0,
        totalCancelPrice: 0,
        totalRentPrice: 0,
        totalAdPrice: 0,
        totalAdCount: 0,
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
        totalAdAmount : 0,
        totalBannerWating : 0,
    });
    useEffect(() => {
        setMounted(true)
    }, [])
    
    // 날짜 계산: startDate, endDate가 바뀌면 비교 구간 계산만 수행
    useEffect(() => {
        const { beforeStartDate, beforeEndDate } = calcComparisonRange(startDate, endDate);
        setBeforeStartDate(beforeStartDate);
        setBeforeEndDate(beforeEndDate);
    }, [startDate, endDate]);

    // 모든 날짜 상태가 세팅된 후에만 대시보드 로딩 실행
    useEffect(() => {
        if (startDate && endDate && beforeStartDate && beforeEndDate) {
            loadDashboardData();
        }
    }, [startDate, endDate, beforeStartDate, beforeEndDate]);


    const refreshData = () => {
        const newStart = getWeekAgo();
        const newEnd = getToday();

        setStartDate(newStart);
        setEndDate(newEnd);
    }
    

const loadDashboardData = async () => {
    if (!(startDate && endDate)) return;

    const end = endDate;

    try {
        // 1. 요약 통계
        const summary = await fetchSalesSummary(startDate, endDate);
        setSummaryData(summary);
        const beforeSummary = await fetchSalesSummary(beforeStartDate,beforeEndDate)
        setBeforeSummaryData(beforeSummary);
        // 2. 특정 날짜별 매출 통계
        const today = await fetchDaySalesSummary(end);
        setSummaryTodaysData(today);

        const dayAgo = await fetchDaySalesSummary(getRelativeDate(end, 1));
        setSummaryDaysAgoData(dayAgo);

        const weekAgo = await fetchDaySalesSummary(getRelativeDate(end, 7));
        setSummaryWeeksAgoData(weekAgo);

        const yearAgo = await fetchDaySalesSummary(getRelativeDate(end, 365));
        setSummaryYearsAgoData(yearAgo);

        const chartData = await fetchSalesChartData(startDate, endDate);
        setCategoryData(chartData);
        if (chartData && Array.isArray(chartData)) {
        setCategoryData(chartData);
        } else if (chartData.categorySales && Array.isArray(chartData.categorySales)) {
        setCategoryData(chartData.categorySales);
        } else {
        console.warn("🚨 차트 데이터 형식이 예상과 다릅니다:", chartData);
        setCategoryData([]);
}
        // 4. 매출 리스트
        const salesList = await fetchSalesList(startDate, endDate);
        setSalesList(salesList);
    } catch (error) {
        console.error("대시보드 데이터 로딩 실패", error);
    }

    
};

    const handleClick = (type) => {
        console.log(startDate);
        setIsClicked(type);
        setTimeout(() => setIsClicked(null), 150);         
        const extension = type === ".xlsx" || type === ".cell" ? type : "";
        window.location.href = `/api/admin/summary/export?atStart=${startDate}&atEnd=${endDate}&extension=${extension}`;
    };


    return (
        <div className="admin-dashboard" style={{backgroundColor:"#f1f3f5"}}>
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
                    <div style={{display:"flex",marginBottom:"10px", cursor: "pointer", backgroundColor: isClicked==="xlsx" ? "#ccc" : "transparent",transition: "background-color 0.2s ease", borderRadius:"4px"}} onClick={()=>{handleClick(".xlsx")}}>
                        <img src="/public/images/icons8-msExcel-48.png" style={{width:"10%",height:"10%"}}/>
                        <h6>&nbsp;&nbsp;엑셀 파일로 내려받기 (.xlsx)</h6>
                    </div>
                    <div style={{display:"flex", cursor: "pointer", backgroundColor: isClicked==="cell" ? "#ccc" : "transparent", transition: "background-color 0.2s ease", borderRadius:"4px"}} onClick={()=>{handleClick(".cell")}}>
                        <img src="/public/images/icon-hancell.png" style={{width:"10%",height:"9%"}}/>
                        <h6>&nbsp;&nbsp;한셀 파일로 내려받기 (.cell)</h6>
                    </div>
                </div>

                <div className="card-refresh" onClick={refreshData} style={{cursor:"pointer", backgroundColor: isClicked==="refresh" ? "#ccc" : "transparent"}}>
                    <img src="/public/images/icons8-refresh-60.png" style={{width:"60px"}}/>
                </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
                <SalesSummaryChart summaryData={summaryData}/>
                <SalesCategoryChart categoryData={categoryData} />
                <StatOverviewCard 
                    stats={{
                        current: summaryData,
                        before: beforeSummaryData,
                        today: summaryTodaysData,
                        dayAgo: summaryDaysAgoData,
                        weekAgo: summaryWeeksAgoData,
                        yearAgo: summaryYearsAgoData
                    }} 
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
