import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";

const MainLayout = () => {
    return (
        <>
            <div className="flex justify-center">
                <MainHeader></MainHeader>
            </div>

            <div className="flex justify-center pb-60">
                <Outlet></Outlet>
            </div>

            <MainFooter></MainFooter>
        </>
    )
}

export default MainLayout;