// src/components/adminpage/AdminSidebar.jsx
import { Link } from "react-router-dom";

const AdminSidebar = () => {
    return (
        <aside className="admin-sidebar">
            <div className="admin-sidebar__profile">
                <img src="/default-profile.png" alt="사진프로필" className="admin-sidebar__profile-icon" />
                <div className="admin-sidebar__name">관리자님</div>
            </div>
            <ul className="admin-sidebar__menu">
                <li><Link to="/admin">대시보드</Link></li>
                <li><Link to="/admin/pendinglist">관리자 요청 승인/관리</Link></li>
                <li><Link to="/admin/userlist">고객 관리</Link></li>
                <li><Link to="/admin/banner">매출 관리</Link></li>
            </ul>
        </aside>
    );
};

export default AdminSidebar;
