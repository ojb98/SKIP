import React, { useEffect, useState } from "react";
import Chart from "chart.js/auto";
import axios from "axios";
import "./admin.css";

const AdminDashboard = () => {
    const [daily, setDaily] = useState({ YESTERDAY: 0, TODAY: 0 });
    const [weekly, setWeekly] = useState({ LASTWEEK: 0, THISWEEK: 0 });
    const [monthly, setMonthly] = useState({ LASTMONTH: 0, THISMONTH: 0 });
    const [yearly, setYearly] = useState({ LASTYEAR: 0, THISYEAR: 0 });
    const [newUsers, setNewUsers] = useState([]);
    const [visitorData, setVisitorData] = useState({ list: [], todayVisitorCount: 0, todayPureVisitorCount: 0 });
    const [totalUsers, setTotalUsers] = useState(0);
    const [currentUsers, setCurrentUsers] = useState(0);

    useEffect(() => {
        axios.get("/api/dashboard/data").then((response) => {
            setDaily(response.data.daily);
            setWeekly(response.data.weekly);
            setMonthly(response.data.monthly);
            setYearly(response.data.yearly);
            setNewUsers(response.data.newUserList);
            setVisitorData(response.data.visitor);
            setTotalUsers(response.data.totalUsers);
            setCurrentUsers(response.data.currentUsers);
        });
    }, []);

    useEffect(() => {
        if (visitorData.list.length > 0) {
            const label = visitorData.list.map((item, index) => index % 10 === 0 ? item.log_date.substr(5, 5) : "");
            label.push("오늘");
            const logCount = visitorData.list.map(o => o.log_count);
            logCount.push(visitorData.todayVisitorCount);
            const uniqueLogCount = visitorData.list.map(o => o.unique_log_count);
            uniqueLogCount.push(visitorData.todayPureVisitorCount);

            new Chart(document.getElementById("visitor_chart"), {
                type: "line",
                data: {
                    labels: label,
                    datasets: [
                        {
                            label: "방문자",
                            data: logCount,
                            borderColor: "rgba(54, 162, 235, 1)",
                            backgroundColor: "rgba(54, 162, 235, 0.5)",
                            borderWidth: 1
                        },
                        {
                            label: "순방문자",
                            data: uniqueLogCount,
                            borderColor: "rgba(255, 206, 86, 1)",
                            backgroundColor: "rgba(255, 206, 86, 0.5)",
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    plugins: {
                        subtitle: {
                            display: true,
                            text: `전체 가입자 수: ${totalUsers}  현재 접속자 수: ${currentUsers}`
                        }
                    }
                }
            });
        }
    }, [visitorData, totalUsers, currentUsers]);

    return (
        <div className="admin-dashboard">
            <header className="header">
                <h1>SKI:P</h1>
            </header>
            <aside className="sidebar">
                <div className="sidebar-profile">
                    <img src="" alt="사진프로필" className="profile-icon" />
                    <div className="admin-name">관리자님</div>
                </div>
                <ul>
                    <li><a href="/admin/dashboard">대시보드</a></li>
                    <li><a href="/admin/adminApprovalRequest">관리자 요청 승인/관리</a></li>
                    <li><a href="/admin/customersInfo">고객 관리</a></li>
                    <li><a href="/admin/paymentsInfo">매출 관리</a></li>
                </ul>
            </aside>
            <main className="main-content">
                <section className="sales-section">
                    <div className="section-item">
                        <section className="section-item-top">
                            <span>어제</span>
                            <span>{daily.YESTERDAY.toLocaleString()}원</span>
                        </section>
                        <section className="section-item-bottom">
                            <h4>일매출</h4>
                            <h1>{daily.TODAY.toLocaleString()}원</h1>
                        </section>
                    </div>
                    <div className="section-item">
                        <section className="section-item-top">
                            <span>지난주</span>
                            <span>{weekly.LASTWEEK.toLocaleString()}원</span>
                        </section>
                        <section className="section-item-bottom">
                            <h4>주매출</h4>
                            <h1>{weekly.THISWEEK.toLocaleString()}원</h1>
                        </section>
                    </div>
                    <div className="section-item">
                        <section className="section-item-top">
                            <span>지난달</span>
                            <span>{monthly.LASTMONTH.toLocaleString()}원</span>
                        </section>
                        <section className="section-item-bottom">
                            <h4>월매출</h4>
                            <h1>{monthly.THISMONTH.toLocaleString()}원</h1>
                        </section>
                    </div>
                    <div className="section-item">
                        <section className="section-item-top">
                            <span>작년</span>
                            <span>{yearly.LASTYEAR.toLocaleString()}원</span>
                        </section>
                        <section className="section-item-bottom">
                            <h4>연매출</h4>
                            <h1>{yearly.THISYEAR.toLocaleString()}원</h1>
                        </section>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;