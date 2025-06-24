import { useState } from "react";
import BannerSlide from "../components/BannerSlide";
import Forecast from "../components/Forecast";
import Ranking from "../components/Ranking";
import SearchBar from "../components/SearchBar";

const Home = () => {
    const [keyword, setKeyword] = useState('');
    const [from, setFrom] = useState();
    const [to, setTo] = useState();
    const [selectedCategories, setSelectedCategories] = useState([]);


    return (
        <>
            <div className="w-full flex flex-col items-center gap-30 font-[NanumSquare]">
                <div className="w-full flex flex-col gap-10 items-center">
                    <BannerSlide></BannerSlide>
                
                    <SearchBar keywordState={[keyword, setKeyword]} fromState={[from, setFrom]} toState={[to, setTo]} selectedCategoriesState={[selectedCategories, setSelectedCategories]}></SearchBar>
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