import { MapPin, Search, ShoppingBasket } from "lucide-react";
import { button } from "./buttons";
import { useState } from "react";
import DatetimeRangeSelect from "./DatetimeRangeSelect";
import SearchRegionSelector from "./SearchRegionSelector";

const SearchBar = () => {
    const [from, setFrom] = useState();
    const [to, setTo] = useState();


    return (
        <>
            <div className="w-[1150px] h-27 flex justify-between p-7 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                <SearchRegionSelector></SearchRegionSelector>

                <DatetimeRangeSelect fromState={[from, setFrom]} toState={[to, setTo]}></DatetimeRangeSelect>

                <div className="w-70 flex justify-between items-center px-5 bg-gray-100/90 border border-gray-200 rounded-xl text-sm font-bold">
                    <p>장비를 선택하세요</p>

                    <ShoppingBasket size={18}></ShoppingBasket>
                </div>
                
                <button
                    className={button({ color: "primary", className: 'w-40 h-full flex justify-center items-center rounded-xl' })}
                >
                    검색
                </button>
            </div>
        </>
    )
};

export default SearchBar;