import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import AdminDashboard from "./pages/components/adminpage/AdminDashBoard"

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout></Layout>}>
                        <Route index element={<Home></Home>}></Route>
                        <Route path="/admin/dashboard" element={<AdminDashboard/>}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
