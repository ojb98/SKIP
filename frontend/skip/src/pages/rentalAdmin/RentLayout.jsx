import { Outlet } from "react-router-dom";
import RentHeader from "../../components/rentManager/RentHeader";
import RentSidebar from "../../components/rentManager/RentSidebar";

const RentLayout = () => {


    return (
        <div className="admin-layout">
            <RentHeader />
            <div className="admin-layout__main">
                <RentSidebar />
                <div className="admin-layout__content" >
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default RentLayout;
