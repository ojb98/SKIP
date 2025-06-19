import { MapPin, Search } from "lucide-react";
import { button } from "./buttons";

const SearchBar = () => {
    return (
        <>
            <div className="w-[1150px] h-27 flex justify-between p-7 border-gray-200 rounded-2xl shadow-xl">
                <details className="group z-10 text-sm">
                    <summary
                        className="w-66 h-full flex justify-between items-center px-3
                        bg-gray-100 border border-gray-200 rounded-xl font-bold
                        group-open:rounded-b-none group-open:bg-white group-open:shadow-xl group-open:shadow-
                        cursor-pointer appearance-none list-none"
                    >
                        <p>어디로 가시나요?</p>

                        <Search size={18}></Search>
                    </summary>

                    <div>
                        <div className="h-fit flex flex-col bg-white border-b border-x border-gray-200 rounded-b-2xl shadow-xl divide-y divide-gray-200">
                            <div className="h-12 bg-gray-100 flex items-center px-3">
                                <span className="font-extrabold"><MapPin size={18} className="inline"></MapPin> 주요도시</span>
                            </div>

                            <div className="h-40 p-3">
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