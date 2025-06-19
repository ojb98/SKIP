import { Link, useParams } from "react-router-dom";
import CustomAccordion from "../adminpage/CustomAccordian";
import { useState } from "react";
import { useSelector } from 'react-redux';

const RentSidebar = () => {

    const { rentId } = useParams();
    const [openIndex, setOpenIndex] = useState(null);

    const handleAccordionClick = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    function Sideprofile() {    
    const { userId, username, isLoggedIn, isLoading, image } = useSelector((state) => state.loginSlice);

    if (isLoading) return <div>로딩 중…</div>;
    if (!isLoggedIn) return <div>로그인해주세요</div>;

    return (        
        <div className="admin-sidebar__profile">
            <img src={image} alt="프로필" width={40} className="admin-sidebar__profile-icon"/>
            <span className="admin-sidebar__name">{username}님, 환영합니다!</span>
        </div>
    );
    }

    return (
        <aside className="admin-sidebar">
            {Sideprofile()}            
            <ul className="admin-sidebar__menu">
                <li><Link to="/rentAdmin" onClick={() => handleAccordionClick(0)}>대시보드</Link></li>
                <li>
                    <CustomAccordion title="대여업체 관리" isOpen={openIndex === 1} onClick={() => handleAccordionClick(1)}>
                        <ul className="sub-menu">
                            <li><Link to="/rentAdmin/insert">업체 등록</Link></li>
                            <li><Link to="/rentAdmin/list">업체 목록</Link></li>
                        </ul>                       
                    </CustomAccordion>
                </li>
                <li>
                    <CustomAccordion title="상품 관리" isOpen={openIndex === 2} onClick={() => handleAccordionClick(2)}>
                        <ul className="sub-menu">
                            <Link to={rentId ? `/rentAdmin/item/insert/${rentId}` : "/rentAdmin/item/insert"}>
                                상품 등록
                            </Link>
                            <li><Link to="/rentAdmin/item/list">상품 관리</Link></li>

                        </ul>
                    </CustomAccordion>
                </li>
                <li>
                    <CustomAccordion title="예약 관리" isOpen={openIndex === 3} onClick={() => handleAccordionClick(3)}>
                        <ul className="sub-menu">
                            <li><Link to="/rentAdmin/reservManager/list">예약 조회</Link></li>
                            <li><Link to="/rentAdmin/refundManager/list">환불 처리</Link></li>                       
                        </ul>
                    </CustomAccordion>
                </li>
                <li>
                    <CustomAccordion title="광고상품 구매·관리" isOpen={openIndex === 4} onClick={() => handleAccordionClick(4)}>
                        <ul className="sub-menu">
                            <li><Link to="/rentAdmin/boost"> 부스트 구매하기</Link></li>
                            <li><Link to="/rentAdmin/banner"> 배너광고 신청·구매하기</Link></li>
                        </ul>
                    </CustomAccordion>
                </li>
            </ul>
        </aside>
    );
};

export default RentSidebar;
