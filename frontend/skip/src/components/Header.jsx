import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, setProfile } from "../slices/loginSlice";
import { useEffect } from "react";

const Header = () => {
    const { isLoggedIn, isLoading } = useSelector(state => state.loginSlice);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log(isLoading, isLoggedIn);

    return (
        <>
            <div className="w-[1100px] h-16 flex justify-between items-center">
                <h1 className="text-3xl text-blue-400 font-[GumiRomanceTTF] italic font-bold"><Link to={"/"}>SKI:P</Link></h1>
                {
                    !isLoading ? 
                        <ul className="flex gap-5">
                            <li><Link to={"/"}>Home</Link></li>
                            {
                                isLoggedIn === true ?
                                <>
                                    <li><Link onClick={() => {
                                        dispatch(logout())
                                            .unwrap()
                                            .then(res => {
                                                dispatch(setProfile());
                                                navigate('/');
                                            });
                                        }}>Logout</Link></li>
                                    <li><Link to={"/mypage/account"}>mypage</Link></li>
                                </> :
                                <li><Link to={"/login"}>Login</Link></li>
                            }
                            <li><Link to="/rentAdmin/insert">가맹점 등록</Link></li>
                            <li><Link to="/rentAdmin/list">가맹점 목록</Link></li>
                        </ul> : <></>
                }
            </div>
        </>
    )
}

export default Header;