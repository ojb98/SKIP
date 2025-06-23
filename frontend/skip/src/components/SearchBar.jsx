import { MapPin, Search, ShoppingBasket } from "lucide-react";
import { button } from "./buttons";
import { useState } from "react";
import DateRangeSelect from "./DateRangeSelect";
import RegionSearchBar from "./RegionSearchBar";
import RentItemSelect from "./RentItemSelect";

const SearchBar = () => {
    const [keyword, setKeyword] = useState('');
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [selectedCategories, setSelectedCategories] = useState([]);


    return (
        <>
            <div className="w-[1150px] h-25 flex justify-between p-6 relative z-10 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                <RegionSearchBar keywordState={[keyword, setKeyword]}></RegionSearchBar>

                <DateRangeSelect fromState={[from, setFrom]} toState={[to, setTo]}></DateRangeSelect>

                <RentItemSelect selectedCategoriesState={[selectedCategories, setSelectedCategories]}></RentItemSelect>
                
                <button
                    className={button({ color: "primary", className: 'w-40 h-full flex justify-center items-center rounded-md' })}
                >
                    검색
                </button>
            </div>
        </>
    )
};

export default SearchBar;