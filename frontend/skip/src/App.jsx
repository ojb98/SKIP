
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import RentInsertForm from "./components/RentInsertForm"

import LoginPage from "./pages/LoginPage"
import JoinPage from "./pages/SignupPage"
import SignupVerifyPage from "./pages/SignupVerifyPage"
import AccountPage from "./pages/AccountPage"
import MyReviewPage from "./pages/MyReviewPage"
import MyQnaPage from "./pages/MyQnaPage"

import RentalshopPage from "./pages/RentalshopPage"
import ProductPage from "./pages/ProductPage"


function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout></Layout>}>
                        {/* 홈페이지 */}
                        <Route index element={<Home></Home>}></Route>

                        <Route path="login" element={<LoginPage></LoginPage>}></Route>

                        <Route path="signup/verify" element={<SignupVerifyPage></SignupVerifyPage>}></Route>

                        <Route path="signup" element={<JoinPage></JoinPage>}></Route>

                        {/* 마이페이지 */}
                        <Route path="mypage/account" element={<AccountPage></AccountPage>}></Route>

                        <Route path="mypage/review" element={<MyReviewPage></MyReviewPage>}></Route>

                        <Route path="mypage/qna" element={<MyQnaPage></MyQnaPage>}></Route>


                        {/* 관리자 등록폼 */}
                        <Route path="/rentAdmin/insert" element={<RentInsertForm/>}></Route>

                        {/* 렌탈샵 상세 페이지 */}
                        <Route path="/rentalshop/detail" element={<RentalshopPage/>}></Route>
                        <Route path="/rentalshop/product" element={<ProductPage/>}></Route>

                        {/* 관리자 영역 */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            {/* 추가 라우트 */}
                            <Route path="/admin/pendinglist" element={<div>Pending List</div>} />
                            <Route path="/admin/withdrawnlist" element={<div>WITHDRAWN List</div>} />
                            <Route path="/admin/rentallist" element={<div>rentalshop List</div>} />
                            <Route path="/admin/userlist" element={<div>user List</div>} />
                            <Route path="/admin/bannerwatinglist" element={<div>banner wating list</div>} />
                            <Route path="/admin/banneractivelist" element={<div>banner active list</div>} />
                            <Route path="/admin/pendinglist" element={<div>Pending List</div>} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
