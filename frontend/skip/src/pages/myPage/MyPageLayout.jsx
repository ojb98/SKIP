import { Outlet, useLocation } from "react-router-dom";
import MySideMenu from "../../components/myPage/MySideMenu";
import { useSelector } from "react-redux";

const MyPageLayout = () => {
    const profile = useSelector(state => state.loginSlice);
    const pathname = useLocation().pathname;
    const active = pathname.substring(pathname.lastIndexOf('/') + 1);
    const group = active == 'account' || active == 'security' ? 'account' : (
        active == 'review' || active == 'qna' ? 'activity' : (
        active == 'reserve' || active == 'refund' ? 'payment' : ''));


    return (
        <>
            <div className="w-[1150px] flex justify-between items-start my-12">
                <MySideMenu group={group} active={active}></MySideMenu>

                <div className="w-[830px] pl-3 font-[NanumSquare]">
                    {
                        !profile.isLoading
                        &&
                        profile.isLoggedIn
                        &&
                        <Outlet></Outlet>
                    }
                </div>
            </div>
        </>
    )
}

export default MyPageLayout;