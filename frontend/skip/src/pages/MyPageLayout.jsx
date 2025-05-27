import { Outlet, useLocation } from "react-router-dom";
import MySideBar from "../components/MySideBar";

const MyPageLayout = () => {
    const pathname = useLocation().pathname;
    const active = pathname.substring(pathname.lastIndexOf('/') + 1);
    const group = active == 'account' || active == 'logout' ? 'account' : (
        active == 'review' || active == 'qna' ? 'activity' : (
        active == 'reserve' || active == 'refund' ? 'payment' : ''));


    return (
        <>
            <div className="w-[1100px] flex justify-between items-start my-12">
                <MySideBar group={group} active={active}></MySideBar>

                <div className="w-[800px] pl-3 font-[NanumSquare]">
                    <Outlet></Outlet>
                </div>
            </div>
        </>
    )
}

export default MyPageLayout;