import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Heart, ShoppingCart } from "lucide-react";
import MainHeaderProfileDropdown from "./MainHeaderProfileDropdown";

const MainHeader = () => {
    const { isLoggedIn, isLoading, image } = useSelector(state => state.loginSlice);

    const dropdownRef = useRef(null);
    
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const location = useLocation();

    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };

        if (dropdownOpen) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    }, [dropdownOpen]);

    useEffect(() => {
        setDropdownOpen(false);
    }, [location]);


    return (
        <>
            <div className="w-full flex justify-center items-center border-b border-gray-200 font-[NanumSquare]">
                <div className="w-[1150px] h-16 flex justify-between items-center">
                    <h1 className="text-3xl text-blue-400 font-[GumiRomanceTTF] italic font-bold"><Link to={"/"}>SKI:P</Link></h1>
                    {
                        !isLoading
                        &&
                        <ul className="flex gap-10">
                            {
                                isLoggedIn
                                &&
                                <>
                                    <li className="flex justify-center items-center">
                                        <Link to="/cart/list" className="p-2 rounded-full hover:bg-gray-100">
                                            <ShoppingCart strokeWidth={1.6} className="stroke-gray-800"></ShoppingCart>
                                        </Link>
                                    </li>
                                    <li className="flex justify-center items-center">
                                        <Link to="/wish/list" className="p-2 rounded-full hover:bg-gray-100">
                                            <Heart strokeWidth={1.6} className="stroke-red-400"></Heart>
                                        </Link>
                                    </li>
                                    <li ref={dropdownRef} className="flex justify-center items-center rounded-full relative">
                                        <button
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="w-10 h-10 rounded-full cursor-pointer"
                                        >
                                            <img src={image} className="rounded-full"></img>
                                        </button>

                                        {
                                            dropdownOpen
                                            &&
                                            <MainHeaderProfileDropdown></MainHeaderProfileDropdown>
                                        }
                                    </li>
                                </>
                                ||
                                <li>
                                    <Link
                                        to={"/login"}
                                        className="w-20 h-10 flex justify-center items-center border border-gray-200 rounded-2xl text-gray-500 shadow-sm transition-colors hover:bg-gray-50"
                                    >Login
                                    </Link>
                                </li>
                            }

                            
                        </ul>
                    }
                </div>
            </div>
        </>
    )
}

export default MainHeader;