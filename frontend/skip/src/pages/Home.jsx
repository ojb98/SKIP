import { useState } from "react";
import BannerSlide from "../components/BannerSlide";
import { radio } from "../components/buttons";
import Forecast from "../components/Forecast";
import Ranking from "../components/Ranking";
import SearchBar from "../components/SearchBar";

const Home = () => {


    return (
        <>
            <div className="w-full flex flex-col items-center gap-30 font-[NanumSquare]">
                <div className="w-full flex flex-col gap-10 items-center">
                    <BannerSlide></BannerSlide>
                
                    <SearchBar></SearchBar>
                </div>

                {/* <span className="w-full flex items-center">
                    <span className="h-px flex-1 bg-gray-200"></span>
                </span> */}
                
                <Forecast></Forecast>

                <Ranking></Ranking>
            </div>
        </>
    )
}

export default Home;