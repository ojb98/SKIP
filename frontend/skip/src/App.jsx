import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"

import LoginPage from "./pages/LoginPage"
import JoinPage from "./pages/SignupPage"
import SignupVerifyPage from "./pages/SignupVerifyPage"
import AccountPage from "./pages/AccountPage"
import MyReviewPage from "./pages/MyReviewPage"
import MyQnaPage from "./pages/MyQnaPage"
import { useDispatch } from "react-redux"
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
import ItemListAndDetails from "./components/rentAdmin/ItemListAndDetails"
import ItemSelectorByRent from "./components/rentAdmin/ItemSelectorByRent"
import ItemUpdateForm from "./components/rentAdmin/ItemUpdateForm"
import QnaPopupPage from "./pages/QnaPopupPage"


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
                        <Route path="/rentAdmin/select" element={<ItemSelectorByRent/>}></Route>
                        <Route path="/itemAdmin/list/:rentId" element={<ItemListAndDetails/>}></Route>
                        <Route path="/itemAdmin/update/:rentId/:itemId" element={<ItemUpdateForm/>}></Route>


                        {/* 렌탈샵 상세 페이지 */}
                        <Route path="/rent/detail/:rentId" element={<RentalshopPage/>}></Route>
                        <Route path="/rent/product/:rentId/:itemId" element={<ProductPage/>}></Route>

                    </Route>
                        {/* 리뷰 팝업 */}
                        <Route path="/mypage/review/write" element={<ReviewPopupPage />}></Route>
                        {/* Q&A 팝업 */}
                        <Route path="/rent/product/:rentId/:itemId/qna/write" element={<QnaPopupPage />}></Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App