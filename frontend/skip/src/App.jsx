import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import JoinPage from "./pages/SignupPage"
import SignupVerifyPage from "./pages/SignupVerifyPage"
import SignupStep from "./components/SignupStep"

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Layout></Layout>}>
                        <Route index element={<Home></Home>}></Route>

                        <Route path="login" element={<LoginPage></LoginPage>}></Route>

                        <Route path="signup/verify" element={<SignupVerifyPage></SignupVerifyPage>}></Route>

                        <Route path="signup" element={<JoinPage></JoinPage>}></Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    )
}

export default App
