import { MapPin, Search } from "lucide-react";
import { button } from "./buttons";

const SearchRegionSelector = () => {
    return (
        <>
            <details className="group z-10 text-sm">
                <summary
                    className="w-80 h-full flex justify-between items-center px-5
                    bg-gray-100/90 border border-gray-200 rounded-xl font-bold
                    group-open:rounded-b-none group-open:bg-white group-open:shadow-[0_4px_10px_rgba(0,0,0,0.25)]
                    cursor-pointer appearance-none list-none"
                >
                    <p>어디로 가시나요?</p>

                    <Search size={18}></Search>
                </summary>

                <div>
                    <div className="h-fit flex flex-col bg-white rounded-b-2xl shadow-[0_4px_10px_rgba(0,0,0,0.25)] divide-y divide-gray-200 ">
                        <div className="h-12 bg-gray-100 flex items-center px-3">
                            <span className="font-bold"><MapPin size={18} className="inline stroke-emerald-500"></MapPin> 주요도시</span>
                        </div>

                        <div className="h-40 p-1">
                            <div className="w-full h-fit grid grid-rows-2 grid-cols-2 text-sm">
                                <div className="w-full h-full flex justify-center items-center p-1">
                                    <button
                                        className={button({ color: "secondary-outline", className: 'w-full h-10 block rounded-md' })}
                                    >
                                        경기
                                    </button>
                                </div>

                                <div className="w-full h-full flex justify-center items-center p-1">
                                    <button
                                        className={button({ color: "secondary-outline", className: 'w-full h-10 block rounded-md' })}
                                    >
                                        강원
                                    </button>
                                </div>

                                <div className="w-full h-full flex justify-center items-center p-1">
                                    <button
                                        className={button({ color: "secondary-outline", className: 'w-full h-10 block rounded-md' })}
                                    >
                                        전북
                                    </button>
                                </div>

                                <div className="w-full h-full flex justify-center items-center p-1">
                                    <button
                                        className={button({ color: "secondary-outline", className: 'w-full h-10 block rounded-md' })}
                                    >
                                        경남
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </details>
        </>
    )
};

export default SearchRegionSelector;