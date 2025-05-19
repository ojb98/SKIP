import { Link } from "react-router-dom";

const Header = () => {
    return (
        <>
            <ul>
                <li><Link>dafasd</Link></li>
                <li><Link to={"/login"}>Login</Link></li>
            </ul>
        </>
    )
}

export default Header;