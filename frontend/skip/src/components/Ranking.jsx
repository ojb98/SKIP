import { useEffect, useState } from "react";
import { radio } from "./buttons";
import { Check, Minus, TrendingDown, TrendingUp } from "lucide-react";
import RankingFilter from "./RankingFilter";
import { fetchTopTenRanking } from "../api/rentStatApi";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const host = __APP_BASE__;

const Ranking = () => {
    const [region, setRegion] = useState('ETC');
    const [period, setPeriod] = useState({
        from: '',
        to: ''
    });
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        fetchTopTenRanking({
            region: region,
            ...period
        }).then(res => {
            if (res.success) {
                console.log(res.data);
                setRanking(res.data);
            } else {
                console.log(res.data);
            }
        });
    }, [region, period]);


    return (
        <>
            <div className="w-[1150px] space-y-10">
                <RankingFilter conditions={{region, period}} conditionSetters={{setRegion, setPeriod}}></RankingFilter>

                <ul className="grid grid-rows-5 grid-cols-2 grid-flow-col gap-5">
                    {
                        ranking.map(r => (
                            <li key={r.rentId} className="flex items-center gap-5">
                                <img src={`${host}/images${r.thumbnail}`} className="w-30 h-30 rounded"></img>

                                <div className="flex flex-col gap-1">
                                    <Link to={`/rent/detail/${r.rentId}`} className="flex gap-3 pl-[3px] font-bold">
                                        <span>{r.rank}</span>
                                        <span>{r.name}</span>
                                    </Link>

                                    <div className="flex gap-2 items-center">
                                        <span>
                                            {
                                                (!r.previousRank || r.previousRank < r.currentRank)
                                                &&
                                                <TrendingUp size={16} stroke="blue"></TrendingUp>
                                                ||
                                                r.previousRank > r.currentRank
                                                &&
                                                <TrendingDown size={16} stroke="red"></TrendingDown>
                                                ||
                                                <Minus size={16} stroke="gray"></Minus>
                                            }
                                        </span>

                                        <div className="flex gap-1 items-center text-sm font-semibold">
                                            <FontAwesomeIcon
                                                icon={faStar}
                                                onMouseEnter={() => setHoverIndex(index)}
                                                onMouseLeave={() => setHoverIndex(-1)}
                                                onClick={() => setSelectedRating(index + 1)}
                                                style={{
                                                    color: '#e9d634'
                                                }}
                                            />
                                            <span>
                                                {r.rating}
                                            </span>
                                        </div>
                                    </div>

                                    <span>{r.streetAddress}</span>
                                </div>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
};

export default Ranking;