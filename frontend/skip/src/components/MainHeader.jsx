import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, setProfile } from "../slices/loginSlice";
import { useEffect } from "react";

const MainHeader = () => {
    const { isLoggedIn, isLoading } = useSelector(state => state.loginSlice);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(isLoading, isLoggedIn);


    return (
        <>
            <div className="w-full flex justify-center  border-b border-gray-200">
                <div className="w-[1100px] h-16 flex justify-between items-center">
                    <h1 className="text-3xl text-blue-400 font-[GumiRomanceTTF] italic font-bold"><Link to={"/"}>SKI:P</Link></h1>
                    {
                        !isLoading ? 
                            <ul className="flex gap-5">
                                {
                                    isLoggedIn === true ?
                                    <>
                                        <li>
                                            <Link onClick={() => {
                                                dispatch(logout())
                                                    .unwrap()
                                                    .then(res => {
                                                        dispatch(setProfile());
                                                        navigate('/');
                                                    });
                                                }}>Logout</Link>
                                        </li>
                                        <li><Link to={"/mypage/account"}>mypage</Link></li>
                                        <li><Link to="/cart/list">장바구니</Link></li>
                                        <li><Link to="/wish/list">찜</Link></li>
                                    </> :
                                    <li><Link to={"/login"}>Login</Link></li>
                                    
                                }

                                <li><button onClick={()=>window.open("/mypage/review/write","_blank","width=600,height=850")}>리뷰작성하기</button></li>

                                <li><Link to="/rentAdmin/insert">가맹점 등록</Link></li>
                                <li><Link to="/rentAdmin/list">가맹점 목록</Link></li>
                                <li><Link to="/rentAdmin/select">장비 관리</Link></li>
                                <li><Link to="/reservManager/list">예약 관리</Link></li>
                            </ul> : <></>
                    }
                </div>
            </div>
        </>
    )
}

export default MainHeader;