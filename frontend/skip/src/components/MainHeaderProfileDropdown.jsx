import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const MainHeaderProfileDropdown = () => {
    const { image, showname, roles } = useSelector(state => state.loginSlice);


    return (
        <>
            <div
                role="menu"
                className="absolute end-0 top-12 z-50 w-56 divide-y divide-gray-200 overflow-hidden rounded border border-gray-200 bg-white shadow-sm"
            >
                <div className="py-4 flex flex-col items-center gap-4">
                    <img src={image} className="w-40 h-40 rounded-full"></img>

                    <span className="text-xl font-semibold">{showname}</span>

                    <ul className="flex gap-5 text-xs">
                        {
                            roles.map((role, index) => (
                                <li key={index}>
                                    {role}
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div>
                    <Link
                        to={'/mypage/account'}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                        role="menuitem"
                    >
                        마이페이지
                    </Link>


                    {
                        roles.includes('MANAGER')
                        &&
                        <Link
                            to={'/rentAdmin'}
                            className="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            role="menuitem"
                        >
                            시설 관리
                        </Link>
                    }


                    {
                        roles.includes('ADMIN')
                        &&
                        <Link
                            to={'/admin'}
                            className="block px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                            role="menuitem"
                        >
                            어드민 페이지
                        </Link>
                    }
                </div>

                <div>
                    <LogoutButton text="로그아웃" styleClass="block w-full px-3 py-2 text-left text-sm font-medium text-red-700 transition-colors hover:bg-red-50"></LogoutButton>
                </div>
            </div>
        </>
    )
};

export default MainHeaderProfileDropdown;