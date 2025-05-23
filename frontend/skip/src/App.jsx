import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"

import LoginPage from "./pages/LoginPage"
import JoinPage from "./pages/SignupPage"
import SignupVerifyPage from "./pages/SignupVerifyPage"
import AccountPage from "./pages/AccountPage"
import MyReviewPage from "./pages/MyReviewPage"
import MyQnaPage from "./pages/MyQnaPage"

import RentalshopPage from "./pages/RentalshopPage"
import ProductPage from "./pages/ProductPage"

import RentInsertForm from "./components/rentAdmin/RentInsertForm"
import RentList from "./components/rentAdmin/RentList"
import RentDetail from "./components/rentAdmin/RentDetail"
import RentUpdateForm from "./components/rentAdmin/RentUpdateForm"
import ItemInsertForm from "./components/rentAdmin/ItemInsertForm"
import ItemList from "./components/rentAdmin/ItemList"


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
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App