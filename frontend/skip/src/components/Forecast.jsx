import { useEffect, useRef, useState } from "react";
import { getForecast, skiListWithCoordinates } from "../api/skiApi";
import Select from "./Select";
import { useDispatch, useSelector } from "react-redux";
import { fetchForecast } from "../slices/forecastsSlice";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import { Link } from "react-router-dom";
import { link } from "./buttons";

const Forecast = () => {
    const skiSelectRef = useRef();

    const [selected, setSelected] = useState("");

    const [skiList, setSkiList] = useState([]);
    const [skiOptions, setSkiOptions] = useState([]);
    const [selectError, setSelectError] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [forecast, setForecast] = useState([]);
    const [detailedIndex, setDetaildIndex] = useState(0);

    const forecasts = useSelector(state => state.forecastsSlice);

    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        skiListWithCoordinates().then(res => {
            if (res.success) {
                setSkiList(res.data);
            } else {
                setSelectError(res.data);
            }
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (skiList.length > 0) {
            setSkiOptions(skiList.map(ski => {
                return {
                    value: ski.rentId,
                    title: ski.name
                };
            }));
        }
    }, [skiList]);

    useEffect(() => {
        if (skiOptions.length > 0) {
            skiChangeHandler();
        }
    }, [skiOptions]);

    useEffect(() => {
        if (forecasts[skiSelectRef.current.value]) {
            showForecast();
        }
    }, [forecasts]);


    const skiChangeHandler = () => {
        setSelected(skiSelectRef.current.value);
        setIsLoading(true);
        const ski = skiList.find(ski => ski.rentId == skiSelectRef.current.value);
        if (forecasts[ski.rentId]) {
            showForecast();
        } else {
            dispatch(fetchForecast({
                rentId: ski.rentId,
                lat: ski.latitude,
                lon: ski.longitude
            }));
        }
    };

    const showForecast = () => {
        setForecast(forecasts[skiSelectRef.current.value]);

        setDetaildIndex(0);

        setIsLoading(false);
    };

    return (
        <>
            <div className="flex gap-5 items-center mb-10">
                <span className="font-semibold">지금 스키장 날씨는?</span>

                <Select selectRef={skiSelectRef} options={skiOptions} onChange={skiChangeHandler} className="w-50 h-10 rounded-xl"></Select>

                {
                    (isLoading || selectError || forecast.length == 0)
                    &&
                    <p className="text-xl text-gray-700">
                        {selectError}
                    </p>
                    ||
                    <>
                        <Link to={`/rent/detail/${selected}`} className={link({})}>바로가기</Link>

                        <span className="h-6 flex">
                            <span className="w-px bg-gray-300"></span>
                        </span>

                        <span>{(skiList?.find(ski => ski.rentId == selected))?.streetAddress}</span>
                    </>
                }
            </div>

            {
                (isLoading || forecast.length == 0)
                &&
                <div className="w-full h-120 grid grid-cols-3 justify-between gap-5">
                    <Skeleton className="!align-top h-full" borderRadius={24}></Skeleton>

                    <div className="w-full col-span-2 grid-rows-2 grid-cols-4 grid grid-flow-col gap-5">
                        {
                            Array.from({ length: 8 }).map((_, index) => {
                                return (
                                    <Skeleton key={index} borderRadius={24} className="!align-top h-full"></Skeleton>
                                )
                            })
                        }
                    </div>
                </div>
                ||
                forecast?.error
                &&
                <p className="text-xl text-gray-700">
                    {forecast?.error}
                </p>
                ||
                <div className="w-full h-120 grid grid-cols-3 justify-between gap-5">
                    <div className="col-span-1 flex flex-col justify-between p-7 border border-gray-200 rounded-3xl shadow-sm cursor-default">
                        <div className="h-[104px] grid grid-cols-2 items-center">
                            <h1 className="text-8xl font-bold">{forecast?.[detailedIndex]?.date}</h1>

                            <div className="h-full grid">
                                <span className="text-3xl text-gray-500 text-end">{forecast?.[detailedIndex]?.time}</span>

                                <span className="text-4xl text-end">{forecast?.[detailedIndex]?.day}요일</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2">
                            <img src={forecast?.[detailedIndex]?.src} width={150}></img>

                            <div className="h-full grid grid-rows-2 items-center">
                                <span className="h-full text-2xl text-gray-500 text-end">{forecast?.[detailedIndex]?.desc}</span>

                                <div className="h-[65%] flex justify-end items-center">
                                    <span className="h-full text-4xl text-end">{forecast?.[detailedIndex]?.temp.replace('°', '')}</span>
                                
                                    <span className="h-full text-xl text-start">°C</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-rows-3 grid-cols-2 gap-5 text-[1.1em]">
                            <span>체감: {forecast?.[detailedIndex]?.feel}</span>

                            <span className="text-end">습도: {forecast?.[detailedIndex]?.humidity}</span>

                            <span>풍속: {forecast?.[detailedIndex]?.wind}</span>

                            <span className="text-end">비: {forecast?.[detailedIndex]?.rain}</span>

                            <span>구름: {forecast?.[detailedIndex]?.cloud}</span>

                            <span className="text-end">눈: {forecast?.[detailedIndex]?.snow}</span>
                        </div>
                    </div>

                    <div className="col-span-2 grid grid-flow-col grid-rows-2 grid-cols-4 gap-5">
                        {
                            forecast?.map((item, index) => {
                                return (
                                    index != detailedIndex
                                    &&
                                    <div
                                        key={index}
                                        onClick={() => setDetaildIndex(index)}
                                        className="flex flex-col justify-evenly items-center border border-gray-200 rounded-3xl shadow-sm hover:bg-gray-50 cursor-pointer"
                                    >
                                        <span className="font-bold">{item.day}</span>
                                        <span className="text-sm text-gray-500">{item.time}</span>
                                        <img src={item.src} width={100}></img>
                                        <span>{item.temp}</span>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            }
        </>
    )
};

export default Forecast;