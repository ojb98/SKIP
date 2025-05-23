import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"

import LoginPage from "./pages/LoginPage"
import JoinPage from "./pages/SignupPage"
import SignupVerifyPage from "./pages/SignupVerifyPage"
import AccountPage from "./pages/AccountPage"
import MyReviewPage from "./pages/MyReviewPage"
import MyQnaPage from "./pages/MyQnaPage"
import { useDispatch, useSelector } from "react-redux"
import { setProfile } from "./slices/loginSlice"
import { useEffect } from "react"

import RentalshopPage from "./pages/RentalshopPage"
import ProductPage from "./pages/ProductPage"
import ReviewPopupPage from "./pages/ReviewPopupPage"

import RentInsertForm from "./components/rentAdmin/RentInsertForm"
import RentList from "./components/rentAdmin/RentList"
import RentDetail from "./components/rentAdmin/RentDetail"
import RentUpdateForm from "./components/rentAdmin/RentUpdateForm"
import ItemInsertForm from "./components/rentAdmin/ItemInsertForm"
import ItemList from "./components/rentAdmin/ItemList"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashBoard"
import UsersList from "./pages/admin/UsersList"


function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setProfile());
    }, []);


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


                        {/* 중간관리자 */}
                        <Route path="/rentAdmin/insert" element={<RentInsertForm/>}></Route>
                        <Route path="/rentAdmin/list" element={<RentList/>}></Route>
                        <Route path="/rentAdmin/detail/:rentId" element={<RentDetail/>}></Route>
                        <Route path="/rentAdmin/update/:rentId" element={<RentUpdateForm/>}></Route>
                        <Route path="/itemAdmin/insert/:rentId" element={<ItemInsertForm/>}></Route>
                        <Route path="/itemAdmin/list" element={<ItemList/>}></Route>


                        {/* 렌탈샵 상세 페이지 */}
                        <Route path="/rentalshop/detail" element={<RentalshopPage/>}></Route>
                        <Route path="/rentalshop/product" element={<ProductPage/>}></Route>

                        
                    </Route>
                    {/* 관리자 라우트 */}
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            {/* 추가 라우트 */}
                            <Route path="/admin/pendinglist" element={<div>Pending List</div>} />
                            <Route path="/admin/withdrawnlist" element={<div>WITHDRAWN List</div>} />
                            <Route path="/admin/rentallist" element={<div>rentalshop List</div>} />
                            <Route path="/admin/userlist" element={<UsersList></UsersList>} />
                            <Route path="/admin/bannerwatinglist" element={<div>banner wating list</div>} />
                            <Route path="/admin/banneractivelist" element={<div>banner active list</div>} />
                            <Route path="/admin/pendinglist" element={<div>Pending List</div>} />
                        </Route>
                        {/* 리뷰 팝업 */}
                        <Route path="/mypage/review/write" element={<ReviewPopupPage />}></Route>

                    
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App