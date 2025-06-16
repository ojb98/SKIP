import { Link } from "react-router-dom";
import CustomAccordion from "../adminpage/CustomAccordian";
import { useState } from "react";
import { useSelector } from 'react-redux';

const RentSidebar = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const handleAccordionClick = (index) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    function Sideprofile() {    
    const { userId, username, isLoggedIn, isLoading } = useSelector(
        state => state.login
    );

    if (isLoading) return <div>로딩 중…</div>;
    if (!isLoggedIn) return <div>로그인해주세요</div>;

    return (        
        <div className="admin-sidebar__profile">
            <img src={state.login.image} alt="프로필" width={40} className="admin-sidebar__profile-icon"/>
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
                    <CustomAccordion title="테스트1" isOpen={openIndex === 1} onClick={() => handleAccordionClick(1)}>
                        <ul className="sub-menu">
                            <li><Link to="/rentAdmin">1</Link></li>
                            <li><Link to="/rentAdmin">2</Link></li>                            
                            <li><Link to="/rentAdmin">3</Link></li>
                        </ul>                        
                    </CustomAccordion>
                </li>
                <li>
                    <CustomAccordion title="테스트2" isOpen={openIndex === 2} onClick={() => handleAccordionClick(2)}>
                        <ul className="sub-menu">
                            <li><Link to="/rentAdmin/userlist"> 1</Link></li>
                        </ul>
                    </CustomAccordion>
                </li>
                <li>
                    <CustomAccordion title="테스트3" isOpen={openIndex === 3} onClick={() => handleAccordionClick(3)}>
                        <ul className="sub-menu">
                            <li><Link to="/rentadmin"> 1</Link></li>
                            <li><Link to="/rentadmin"> 2</Link></li>                            
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
