import { useState } from "react";
import BannerSlide from "../components/BannerSlide";
import { radio } from "../components/buttons";
import Forecast from "../components/Forecast";
import MainInfoCategory from "../components/MainInfoCategory";
import Ranking from "../components/Ranking";

const Home = () => {
    const [checkedInfo, setCheckedInfo] = useState('forecast');


    return (
        <>
            <div className="w-full flex flex-col items-center gap-60 font-[NanumSquare]">
                <div className="w-full">
                    <BannerSlide></BannerSlide>
                </div>

                {/* <span className="w-full flex items-center">
                    <span className="h-px flex-1 bg-gray-200"></span>
                </span> */}
                
                <div className="w-[1150px] space-y-15">
                    <MainInfoCategory onClick={e => setCheckedInfo(e.target.value)}></MainInfoCategory>

                    {
                        checkedInfo == 'ranking'
                        &&
                        <Ranking></Ranking>
                        ||
                        checkedInfo == 'forecast'
                        &&
                        <Forecast></Forecast>
                    }
                </div>
            </div>
        </>
    )
}

export default Home;