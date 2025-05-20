// src/App.jsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./pages/Layout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/admin/AdminDashBoard";
import AdminLayout from "./pages/admin/AdminLayout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* 일반 사용자 영역 */}
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                </Route>

                {/* 관리자 영역 */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    {/* 추가 라우트 */}
                    <Route path="pendinglist" element={<div>Pending List</div>} />
                    <Route path="customerlist" element={<div>Customer List</div>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
