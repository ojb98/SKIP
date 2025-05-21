import { Link } from "react-router-dom";

const Header = () => {
    return (
        <>
            <ul>  
                <li><Link to={"/login"}>Login</Link></li>
                <li><Link to={"/mypage/account"}>mypage</Link></li>

                <li><Link to="/rentAdmin/insert">가맹점 등록</Link></li>

            </ul>
        </>
    )
}

export default Header;