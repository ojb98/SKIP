import { Outlet } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";

const MainLayout = () => {
    return (
        <>
            <div className="min-h-screen flex flex-col">
                <div className="flex justify-center">
                    <MainHeader></MainHeader>
                </div>

                <div className="w-full flex-1 place-items-center pb-30">
                    <Outlet></Outlet>
                </div>

                <MainFooter></MainFooter>
            </div>
        </>
    )
}

export default MainLayout;