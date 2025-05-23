import { Outlet } from "react-router-dom";
import Header from "../components/Header";

const Layout = () => {
    return (
        <>
            <div className="flex justify-center">
                <Header></Header>
            </div>

            <div className="flex justify-center">
                <Outlet></Outlet>
            </div>

            {/* 푸터 */}
        </>
    )
}

export default Layout;