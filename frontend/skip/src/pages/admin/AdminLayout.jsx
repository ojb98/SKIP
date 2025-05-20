// src/pages/admin/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import AdminHeader from "../../components/adminpage/AdminHeader";
import AdminSidebar from "../../components/adminpage/AdminSidebar";
import "../../styles/admin/admin.css";

const AdminLayout = () => {
    return (
        <div className="admin-layout">
            <AdminHeader />
            <div className="admin-layout__main">
                <AdminSidebar />
                <div className="admin-layout__content">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;
