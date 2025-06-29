import { AlertCircle, MapPin, X } from "lucide-react";
import { inputText } from "./inputs";
import { button } from "./buttons";
import { fetchAutocomplete } from "../api/rentListApi";
import { useEffect, useRef, useState } from "react";

const RegionSelect = ({ regions, keywordState, onClose }) => {
    const searchRef = useRef();

    const [keyword, setKeyword] = keywordState;
    const [showAutocomplete, setShowAutocomplete] = useState(false);
    const [autocomplete, setAutocomplete] = useState([]);

    useEffect(() => {
        searchRef.current.focus();
    }, []);

    useEffect(() => {
        searchRef.current.value = keyword;
    }, [keyword]);

    useEffect(() => {
        if (!showAutocomplete) {
            setAutocomplete([]);
        }
    }, [showAutocomplete]);


    const handleAutocomplete = ({ target: { value } }) => {
        if (value.length > 0) {
            setShowAutocomplete(true);

            fetchAutocomplete(value).then(res =>{
                if (res.success) {
                    setAutocomplete(res.data);
                }
            });
        } else {
            setShowAutocomplete(false)
        }
    };

    const handleSelect = (keyword = searchRef.current.value) => {
        setKeyword(keyword);
        onClose();
    };

    return (
        <>
            <div className="w-100 h-fit absolute left-0 top-0 divide-y divide-gray-200 rounded-xl bg-white shadow-[0_4px_10px_rgba(0,0,0,0.25)] cursor-default">
                <div className="h-fit relative p-5.5">
                    <input
                        type="text"
                        ref={searchRef}
                        placeholder="지역명, 시설명 검색"
                        onInput={handleAutocomplete}
                        onKeyDown={({ key }) => key == 'Enter' ? handleSelect() : null}
                        className={inputText({ className: 'w-full h-14' })}
                    ></input>

                    <button
                        onClick={() => {
                            setKeyword('');
                            setShowAutocomplete(false);
                        }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer"
                    >
                        <X size={18}></X>
                    </button>
                </div>

                {
                    showAutocomplete
                    &&
                    <ul className="pb-5 divide-y divide-gray-200">
                        {
                            autocomplete.length == 0
                            &&
                            <li className="flex justify-center items-center gap-1 p-10">
                                <AlertCircle size={20} className="inline"></AlertCircle><p>검색된 결과가 없습니다.</p>
                            </li>
                            ||
                            autocomplete.map((k, i) => (
                                <li key={i} onClick={() => handleSelect(k)} className="p-5 text-sm text-black font-bold cursor-pointer">{k}</li>
                            ))
                        }
                    </ul>
                    ||
                    <>
                        <div className="p-5 bg-gray-50 font-extrabold">
                            주요도시
                        </div>

                        <div className="grid grid-cols-3 grid-flow-row gap-2 p-5">
                            {
                                regions.filter(region => region.value != 'ETC').map(region => (
                                    <div key={region.value}>
                                        <button
                                            onClick={() => handleSelect(region.shortName)}
                                            className={button({ color: "secondary-outline", className: 'w-full h-11 block rounded text-sm font-semibold' })}
                                        >
                                            {region.shortName}
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                    </>
                }
            </div>
        </>
    )
};

export default RegionSelect;