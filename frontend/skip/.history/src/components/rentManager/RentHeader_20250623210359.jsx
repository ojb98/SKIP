import { Link } from "react-router-dom";


const RentHeader = () => {
    return (
        <header className="admin-header">
            <div className="header-left">
                <Link to="/rentAdmin">
                    <h1>SKI:P</h1>
                </Link>
            </div>
            <div className="header-right">
                <div>
                <Link to="/">
                    <h1 style={{fontSize:"14px"}}>메인페이지로 이동</h1>
                </Link>
                </div>                
            </div>
        </header>
    );
};

export default RentHeader;
