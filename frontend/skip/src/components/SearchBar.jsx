import { MapPin, Search, ShoppingBasket } from "lucide-react";
import { button } from "./buttons";
import { useState } from "react";
import DateRangeSelect from "./DateRangeSelect";
import RegionSearchBar from "./RegionSearchBar";
import RentItemSelect from "./RentItemSelect";
import { useNavigate } from "react-router-dom";

const SearchBar = ({ keywordState, fromState, toState, selectedCategoriesState }) => {
    const [keyword, setKeyword] = keywordState;
    const [from, setFrom] = fromState;
    const [to, setTo] = toState;
    const [selectedCategories, setSelectedCategories] = selectedCategoriesState;

    const navigate = useNavigate();


    const handleSearch = () => {
        const params = new URLSearchParams();
        params.append('keyword', keyword);
        params.append('from', from ? from.toISOString().split('T')[0] : '');
        params.append('to', to ? to.toISOString().split('T')[0] : '');
        params.append('sort', 'DEFAULT');
        selectedCategories.forEach(c => params.append('categories', c.value));

        navigate(`/rent/search?${params.toString()}`);
    };

    return (
        <>
            <div className="w-[1150px] h-25 flex justify-between p-6 relative z-10 rounded-2xl shadow-[0_4px_10px_rgba(0,0,0,0.25)]">
                <RegionSearchBar keywordState={[keyword, setKeyword]}></RegionSearchBar>

                <DateRangeSelect fromState={[from, setFrom]} toState={[to, setTo]}></DateRangeSelect>

                <RentItemSelect selectedCategoriesState={[selectedCategories, setSelectedCategories]}></RentItemSelect>
                
                <button
                    onClick={handleSearch}
                    className={button({ color: "primary", className: 'w-40 h-full flex justify-center items-center rounded-md' })}
                >
                    검색
                </button>
            </div>
        </>
    )
};

export default SearchBar;