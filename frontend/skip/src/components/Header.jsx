import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, setProfile } from "../slices/loginSlice";
import { useEffect } from "react";

const Header = () => {
    const { isLoggedIn, isLoading } = useSelector(state => state.loginSlice);
    const navigate = useNavigate();
    const dispatch = useDispatch();


    useEffect(() => {
        dispatch(setProfile());
    }, []);

    return (
        <>
            {
                !isLoading ? 
                    <ul>
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
                    </ul> : <></>
            }
        </>
    )
}

export default Header;