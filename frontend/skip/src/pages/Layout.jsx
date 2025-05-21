import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
    return (
        <>
            <Header></Header>

            <div className="flex justify-center">
                <Outlet></Outlet>
            </div>

            {/* 푸터 */}
        </>
    )
}

export default Layout;