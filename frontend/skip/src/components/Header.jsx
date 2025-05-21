import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../slices/loginSlice";

const Header = () => {
    const dispatch = useDispatch();
    const { loggedIn } = useSelector(state => state.loginSlice);


    const logoutHandler = () => {
        dispatch(logout());
    }

    return (
        <>
            <ul>
                <li><Link to={"/"}>Home</Link></li>
                {
                    loggedIn ?
                    <>
                        <li><Link onClick={logoutHandler}>Logout</Link></li>
                        <li><Link to={"/mypage/account"}>mypage</Link></li>
                    </> :
                    <li><Link to={"/login"}>Login</Link></li>
                }
            </ul>
        </>
    )
}

export default Header;