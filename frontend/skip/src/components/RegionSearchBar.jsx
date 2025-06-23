import { MapPin, Search } from "lucide-react";
import { button } from "./buttons";
import { useEffect, useRef, useState } from "react";
import { fetchRegions } from "../api/rentListApi";
import RegionSelect from "./RegionSelect";

const RegionSearchBar = ({ keywordState }) => {
    const regionSelectRef = useRef();

    const [regions, setRegions] = useState([]);
    const [showRegionSelect, setShowRegionSelect] = useState(false);
    const [keyword, setKeyword] = keywordState;

    useEffect(() => {
        fetchRegions().then(res => {
            if (res.success) {
                setRegions(res.data);
            }
        })
    }, []);

    useEffect(() => {
        const handleClickOutside = e => {
            if (regionSelectRef.current && !regionSelectRef.current.contains(e.target)) {
                setShowRegionSelect(false);
            }
        };

        if (showRegionSelect) {
            document.addEventListener('click', handleClickOutside);
        }

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };

    }, [showRegionSelect]);


    return (
        <>
            <div
                ref={regionSelectRef}
            >
                <div
                    onClick={() => setShowRegionSelect(true)}
                    className="w-80 h-full flex justify-between items-center px-5
                    bg-white border border-blue-400 rounded-md
                    text-gray-600 cursor-text appearance-none list-none"
                >
                    <p className="text-sm">{keyword || "어디로 가시나요?"}</p>

                    <Search size={18}></Search>
                </div>

                {
                    showRegionSelect
                    &&
                    <RegionSelect regions={regions} setKeyword={setKeyword} onClose={() => setShowRegionSelect(false)}></RegionSelect>
                }
            </div>
        </>
    )
};

export default RegionSearchBar;