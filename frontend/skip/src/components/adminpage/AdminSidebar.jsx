// src/components/adminpage/AdminSidebar.jsx
import { Link } from "react-router-dom";
import CustomAccordion from "./CustomAccordian";
import { useState } from "react";

const AdminSidebar = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleAccordionClick = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__profile">
                <img src="/default-profile.png" alt="사진프로필" className="admin-sidebar__profile-icon" />
                <div className="admin-sidebar__name">관리자님</div>
            </div>
            <ul className="admin-sidebar__menu">
                <li><Link to="/admin" onClick={() => handleAccordionClick(0)}>대시보드</Link></li>
                <li>
                    <CustomAccordion title="가맹점 요청 승인/관리" isOpen={openIndex === 1} onClick={() => handleAccordionClick(1)}>
                        <ul className="sub-menu">
                            <li><Link to="/admin/pendinglist">요청 대기 리스트</Link></li>
                            <li><Link to="/admin/withdrawnlist">요청 거부 리스트</Link></li>
                            <li><Link to="/admin/rentallist">가맹점 리스트 조회</Link></li>
                        </ul>
                    </CustomAccordion>
                </li>
                <li>
                    <CustomAccordion title="고객 관리" isOpen={openIndex === 2} onClick={() => handleAccordionClick(2)}>
                        <ul className="sub-menu">
                            <li><Link to="/admin/userlist"> 고객정보 조회/관리</Link></li>
                            <li><Link to="/admin"> 예비</Link></li>
                        </ul>
                    </CustomAccordion>
                </li>
                <li>
                    <CustomAccordion title="광고 관리" isOpen={openIndex === 3} onClick={() => handleAccordionClick(3)}>
                        <ul className="sub-menu">
                            <li><Link to="/admin/bannerwatinglist"> 배너 승인</Link></li>
                            <li><Link to="/admin/banneractivelist"> 배너 등록</Link></li>
                            <li><Link to="/admin"> 예비</Link></li>
                        </ul>
                    </CustomAccordion>
                </li>
            </ul>
        </aside>
    );
};

export default AdminSidebar;
