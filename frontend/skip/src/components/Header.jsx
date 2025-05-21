import { Link } from "react-router-dom";

const Header = () => {
    return (
        <>
            <ul>
                <li><Link to={"/login"}>Login</Link></li>
                <li><Link to={"/mypage/account"}>mypage</Link></li>
            </ul>
        </>
    )
}

export default Header;