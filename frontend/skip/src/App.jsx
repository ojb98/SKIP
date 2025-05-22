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
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
