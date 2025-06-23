import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import DateInput from "../../components/adminpage/DateInput";
import SalesSummaryChart from "../../components/adminpage/SalesSummaryChart";
import SalesCategoryChart from "../../components/adminpage/SalesCategoryChart";
import StatOverviewCard from "../../components/adminpage/StatOverviewCard";
import { fetchRentSummary, fetchRentChart } from "../../services/admin/rentDashboardService";
import { findRentByUserId } from "../../services/admin/RentListService";
import Odometer from "react-odometerjs";
import "odometer/themes/odometer-theme-default.css";

const RentDashboard = () => {
  const { userId } = useSelector(state => state.loginSlice);
  const getToday = () => new Date().toISOString().split("T")[0];
  const getWeekAgo = () => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split("T")[0];
  };

  const getRelativeDate = (base, diffDays) => {
    const d = new Date(base);
    d.setDate(d.getDate() - diffDays);
    return d.toISOString().split("T")[0];
  };

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


  const [startDate, setStartDate] = useState(getWeekAgo());
  const [endDate, setEndDate] = useState(getToday());  
  const [mounted, setMounted] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [beforeStartDate, setBeforeStartDate] = useState();
  const [beforeEndDate, setBeforeEndDate] = useState();
  const emptySummary = {
    totalSales: 0,
    totalSalesCount: 0,
    totalProfit: 0,
    totalSuccessCount: 0,
    totalCancelPrice: 0,
    totalCancelCount: 0,
    totalAdCash: 0,
    reservationCount: 0,
  };
  const [summaryData, setSummaryData] = useState(emptySummary);
  const [beforeSummaryData, setBeforeSummaryData] = useState(emptySummary);
  const [summaryTodaysData, setSummaryTodaysData] = useState(emptySummary);
  const [summaryDaysAgoData, setSummaryDaysAgoData] = useState(emptySummary);
  const [summaryWeeksAgoData, setSummaryWeeksAgoData] = useState(emptySummary);
  const [summaryYearsAgoData, setSummaryYearsAgoData] = useState(emptySummary);
  const [chartData, setChartData] = useState([]);
  const [rentList, setRentList] = useState([]);
  const [selectedRentId, setSelectedRentId] = useState(null);

  useEffect(() => {
    if (!userId) return;
    findRentByUserId(userId).then(list => {
      setRentList(list);
      if (list.length > 0) setSelectedRentId(list[0].rentId);
    });
  }, [userId]);

  useEffect(() => {
    const { beforeStartDate, beforeEndDate } = calcComparisonRange(startDate, endDate);
    setBeforeStartDate(beforeStartDate);
    setBeforeEndDate(beforeEndDate);
  }, [startDate, endDate]);

  useEffect(() => {
    if (!userId || selectedRentId === null || !beforeStartDate || !beforeEndDate) return;
    loadData();
    }, [userId, selectedRentId, startDate, endDate, beforeStartDate, beforeEndDate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadData = async () => {
    const summary = await fetchRentSummary(userId, selectedRentId, startDate, endDate);
    setSummaryData(summary);
    
    const beforeSummary = await fetchRentSummary(
      userId,
      selectedRentId,
      beforeStartDate,
      beforeEndDate
    );
    setBeforeSummaryData(beforeSummary);

    const today = await fetchRentSummary(userId, selectedRentId, endDate, endDate);
    setSummaryTodaysData(today);

    const dayAgoDate = getRelativeDate(endDate, 1);
    const dayAgo = await fetchRentSummary(userId, selectedRentId, dayAgoDate, dayAgoDate);
    setSummaryDaysAgoData(dayAgo);

    const weekAgoDate = getRelativeDate(endDate, 7);
    const weekAgo = await fetchRentSummary(userId, selectedRentId, weekAgoDate, weekAgoDate);
    setSummaryWeeksAgoData(weekAgo);

    const yearAgoDate = getRelativeDate(endDate, 365);
    const yearAgo = await fetchRentSummary(userId, selectedRentId, yearAgoDate, yearAgoDate);
    setSummaryYearsAgoData(yearAgo);

    const chart = await fetchRentChart(userId, selectedRentId, startDate, endDate);
    setChartData(chart);
  };

  const handleClick = (type) => {
    setIsClicked(type);
    setTimeout(() => setIsClicked(null), 150);
    const extension = type === ".xlsx" || type === ".cell" ? type : "";
    window.location.href = `/api/rentAdmin/summary/export?userId=${userId}&rentId=${selectedRentId}&atStart=${startDate}&atEnd=${endDate}&extension=${extension}`;
  };
  

  return (
    <div className="admin-dashboard" style={{ paddingTop:"0px", backgroundColor: "#f1f3f5" }}>
      <div style={{display:"flex",justifyContent: "space-between", alignItems: "center" }}>
      <h2>📊 렌탈샵 매출 관리</h2>
      <div>
      <span>렌탈샵 선택:&nbsp;</span>
      <select value={selectedRentId} onChange={e => setSelectedRentId(Number(e.target.value))} style={{border:"1px solid #c4c4c4", borderRadius:"4px", marginLeft:"5px"}}>
        {rentList.map(r => (
          <option key={r.rentId} value={r.rentId}>{r.name}</option>
        ))}
      </select>
      </div>
      </div>
      <div style={{ display: "flex", marginTop: "10px" }}>
        <div className="date-card">
          <h3>📅 조회일자 선택</h3>
          <DateInput startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} />
        </div>
        <div className="card-sales">
          <h3>💰 총 매출</h3>
          <div className="odometer">
            <Odometer value={mounted ? summaryData.totalSales || 0 : 0} format="(,ddd)" duration={500} /> 원
          </div>
        </div>
        <div className="card-sales" style={{width:"150px"}}>
          <h3>💸 순 이익</h3>
          <div className="odometer">
            <Odometer value={mounted ? summaryData.totalProfit || 0 : 0} format="(,ddd)" duration={500} /> 원
          </div>
        </div>
        <div className="card">
          <h3>✅ 결제 완료</h3>
          <div className="odometer">
            <Odometer value={mounted ? summaryData.totalSuccessCount || 0 : 0} duration={500} /> 건
          </div>
        </div>
        <div className="card">
          <h3>❌ 결제 취소</h3>
          <div className="odometer">
            <Odometer value={mounted ? summaryData.totalCancelCount || 0 : 0} duration={500} /> 건
          </div>
        </div>
        <div className="card-sales" style={{width:"150px"}}>
          <h3>📣 잔여 광고 캐시</h3>
          <div className="odometer">
            <Odometer value={mounted ? summaryData.totalAdCash || 0 : 0} format="(,ddd)" duration={500} /> 원
          </div>
        </div>
        <div className="card">
          <h3>📦 예약 건수</h3>
          <div className="odometer">
            <Odometer value={mounted ? summaryData.reservationCount || 0 : 0} duration={500} /> 건
          </div>
        </div>
        <div className="card-excel" style={{padding:"10px"}}>
          <h3>📃 매출전표</h3>
          <div style={{display:"flex",marginBottom:"5px", marginTop:"5px", cursor: "pointer", backgroundColor: isClicked==="xlsx" ? "#ccc" : "transparent",transition: "background-color 0.2s ease", borderRadius:"4px"}} onClick={()=>{handleClick(".xlsx")}}>
                <img src="/public/images/icons8-msExcel-48.png" style={{width:"10%",height:"10%"}}/>
                <h6>&nbsp;&nbsp;엑셀 파일로 내려받기 (.xlsx)</h6>
            </div>
            <div style={{display:"flex", cursor: "pointer", backgroundColor: isClicked==="cell" ? "#ccc" : "transparent", transition: "background-color 0.2s ease", borderRadius:"4px"}} onClick={()=>{handleClick(".cell")}}>
                <img src="/public/images/icon-hancell.png" style={{width:"10%",height:"9%"}}/>
                <h6>&nbsp;&nbsp;한셀 파일로 내려받기 (.cell)</h6>
            </div>
        </div>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: "20px" }}>
        <SalesSummaryChart summaryData={summaryData} />
        <SalesCategoryChart categoryData={chartData} />
        <StatOverviewCard
          stats={{
            current: summaryData,
            before: beforeSummaryData,
            today: summaryTodaysData,
            dayAgo: summaryDaysAgoData,
            weekAgo: summaryWeeksAgoData,
            yearAgo: summaryYearsAgoData,
          }}
        />
      </div>
    </div>
  );
};

export default RentDashboard;