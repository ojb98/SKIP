import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import MainLayout from "./pages/MainLayout"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
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
import ItemListAndDetails from "./components/rentAdmin/ItemListAndDetails"
import ItemSelectorByRent from "./components/rentAdmin/ItemSelectorByRent"
import ItemUpdateForm from "./components/rentAdmin/ItemUpdateForm"
import CartList from "./components/cart/cartList"
import QnaPopupPage from "./pages/QnaPopupPage"
import AdminLayout from "./pages/admin/AdminLayout"
import AdminDashboard from "./pages/admin/AdminDashBoard"
import UsersList from "./pages/admin/UsersList"
import LoginLayout from "./pages/LoginLayout"
import AccountPage from "./pages/myPage/AccountPage"
import AccountSecurityPage from "./pages/myPage/AccountSecurityPage"
import MyReviewPage from "./pages/myPage/MyReviewPage"
import MyQnaPage from "./pages/myPage/MyQnaPage"
import MyPageLayout from "./pages/myPage/MyPageLayout"
import AdminQnaList from "./components/qna/AdminQnaList"
import UserApprovalList from "./pages/admin/UserApprovalList"
import WishList from "./components/wishList"
import UserApprovalTable from "./components/adminpage/UserApprovalTable"
import UserPendingTable from "./components/adminpage/UserPendingTable"
import UserWithdrawTable from "./components/adminpage/UserWithdrawTable"



function App() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setProfile());
    }, []);


    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout></MainLayout>}>
                        {/* 홈페이지 */}
                        <Route index element={<Home></Home>}></Route>

                        {/* 마이페이지 */}
                        <Route path="mypage/" element={<MyPageLayout></MyPageLayout>}>
                            <Route path="account" element={<AccountPage></AccountPage>}></Route>

                            <Route path="account/security" element={<AccountSecurityPage></AccountSecurityPage>}></Route>

                            <Route path="review" element={<MyReviewPage></MyReviewPage>}></Route>

                            <Route path="qna" element={<MyQnaPage></MyQnaPage>}></Route>
                        </Route>


                        {/* 중간관리자 */}
                        <Route path="/rentAdmin/insert" element={<RentInsertForm/>}></Route>
                        <Route path="/rentAdmin/list" element={<RentList/>}></Route>
                        <Route path="/rentAdmin/detail/:rentId" element={<RentDetail/>}></Route>
                        <Route path="/rentAdmin/update/:rentId" element={<RentUpdateForm/>}></Route>
                        <Route path="/itemAdmin/insert/:rentId" element={<ItemInsertForm/>}></Route>
                        <Route path="/rentAdmin/select" element={<ItemSelectorByRent/>}></Route>
                        <Route path="/itemAdmin/list/:rentId" element={<ItemListAndDetails/>}></Route>
                        <Route path="/itemAdmin/update/:rentId/:itemId" element={<ItemUpdateForm/>}></Route>
                        
                        {/* 사용자 장바구니 */}
                        <Route path="/cart/list" element={<CartList/>}></Route>
                        {/* 사용자 찜 */}
                        <Route path="/wish/list" element={<WishList/>}></Route>

                        {/* 렌탈샵 상세 페이지 */}
                        <Route path="/rent/detail/:rentId" element={<RentalshopPage/>}></Route>
                        <Route path="/rent/product/:rentId/:itemId" element={<ProductPage/>}></Route>
                    </Route>

                    {/* 관리자 라우트 */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        {/* 추가 라우트 */}
                        <Route path="/admin/pendinglist" element={<UserPendingTable/>} />
                        <Route path="/admin/withdrawnlist" element={<UserWithdrawTable/>} />
                        <Route path="/admin/approvallist" element={<UserApprovalTable/>} />                        
                        <Route path="/admin/userlist" element={<UsersList/>} />
                        <Route path="/admin/bannerwatinglist" element={<div>banner wating list</div>} />
                        <Route path="/admin/banneractivelist" element={<div>banner active list</div>} />
                        <Route path="/admin/pendinglist" element={<div>Pending List</div>} />
                        <Route path="/admin/qna" element={<AdminQnaList></AdminQnaList>} />
                    </Route>
                    {/* 리뷰 팝업 */}
                    <Route path="/mypage/review/write" element={<ReviewPopupPage />}></Route>
                    {/* Q&A 팝업 */}
                    <Route path="/rent/product/:rentId/:itemId/qna/write" element={<QnaPopupPage />}></Route>
                    <Route path="/rent/product/:rentId/:itemId/qna/edit/:qnaId" element={<QnaPopupPage mode="edit"/>}/>


                    {/* 로그인 */}
                    <Route element={<LoginLayout></LoginLayout>}>
                        <Route path="/login" element={<LoginPage></LoginPage>}></Route>

                        <Route path="/signup" element={<SignupPage></SignupPage>}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App;