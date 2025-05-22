import { Link } from "react-router-dom";
import ReviewPopupPage from "../pages/ReviewPopupPage";

const Header = () => {

    return (
        <>
            <ul>  
                <li><Link to={"/login"}>Login</Link></li>
                <li><Link to={"/mypage/account"}>mypage</Link></li>

                <li><Link to="/rentAdmin/insert">가맹점 등록</Link></li>
                <li><button onClick={()=>window.open("/mypage/review/write","_blank","width=600,height=850")}>리뷰작성하기</button></li>
            </ul>

        </>
    )
}

export default Header;