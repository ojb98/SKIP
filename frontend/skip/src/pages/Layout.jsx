import { Outlet } from "react-router-dom";
import Header from "./Header";

const Layout = () => {
    return (
        <>
            <Header></Header>

            <Outlet></Outlet>

            {/* 푸터 */}
        </>
    )
}

export default Layout;