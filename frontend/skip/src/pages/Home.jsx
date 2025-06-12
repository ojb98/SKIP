import BannerSlide from "../components/BannerSlide";
import { radio } from "../components/buttons";
import Forecast from "../components/Forecast";
import MainInfoCategory from "../components/MainInfoCategory";

const Home = () => {



    return (
        <>
            <div className="w-full flex flex-col items-center font-[NanumSquare]">
                <BannerSlide></BannerSlide>
                
                <div className="w-[1150px] space-y-15 py-50">
                    <MainInfoCategory></MainInfoCategory>

                    <Forecast></Forecast>
                </div>
            </div>
        </>
    )
}

export default Home;