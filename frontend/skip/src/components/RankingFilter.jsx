import { useEffect, useRef } from "react";
import { radio } from "./buttons";
import { select } from "./inputs";

const RankingFilter = ({ regions, conditions, conditionSetters }) => {
    const fromRef = useRef();
    const toRef = useRef();
    const filterRef = useRef();

    const { region, period } = conditions;
    const { setRegion, setPeriod } = conditionSetters;

    useEffect(() => {
        console.log(regions);
        const handleClickOutside = e => {
            if (filterRef.current && !filterRef.current.contains(e.target)) {
                filterRef.current.open = false;
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        fromRef.current.value = period?.from;
        toRef.current.value = period?.to;
    }, [region]);


    const applyRegion = e => {
        setRegion(e.target.value);
    };

    const applyPeriod = () => {
        setPeriod({
            from: fromRef.current.value,
            to: toRef.current.value
        });
    };

    return (
        <>
            <div className="flex items-start justify-between">
                <fieldset className="flex items-center gap-2">
                    {
                        regions.map(region => (
                            <div key={region.value}>
                                <label htmlFor={region.value} className={radio({ color: "primary", className: 'w-15 h-9 rounded-3xl' })}>
                                    <p>{region.value == 'ETC' ? '전체' : region.shortName}</p>

                                    <input
                                        type="radio"
                                        id={region.value}
                                        name="region"
                                        value={region.value}
                                        defaultChecked={region.value == 'ETC'}
                                        onClick={applyRegion}
                                        className="sr-only"
                                    ></input>
                                </label>
                            </div>
                        ))
                    }
                </fieldset>

                <details ref={filterRef} className="w-50 group relative">
                    <summary
                        className="flex items-center justify-between gap-2 px-5 py-2 text-black transition-colors [&::-webkit-details-marker]:hidden rounded-2xl border border-gray-200 shadow-sm group-open:rounded-b-none"
                    >
                        <span className="text-sm font-medium">기간</span>

                        <span className="transition-transform group-open:-rotate-180">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="size-4"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </span>
                    </summary>

                    <div
                        className="w-50 absolute top-full z-10 hidden group-open:block bg-white border-x border-b border-gray-200 rounded-b-2xl divide-y divide-gray-300 shadow-sm"
                    >
                        <div className="flex flex-col gap-5 p-5">
                            <label htmlFor="from" className="flex flex-col">
                                <span className="text-sm text-gray-700">시작</span>

                                <input
                                    type="date"
                                    id="from"
                                    ref={fromRef}
                                    className={select({ className: 'h-9 px-2' })}
                                />
                            </label>

                            <label htmlFor="to" className="flex flex-col">
                                <span className="text-sm text-gray-700">끝</span>

                                <input
                                    type="date"
                                    id="to"
                                    ref={toRef}
                                    className={select({ className: 'h-9 px-2' })}
                                />
                            </label>
                        </div>

                        
                        <div className="flex items-center justify-end px-5 py-2">
                            <button
                                type="button"
                                onClick={applyPeriod}
                                className="text-sm text-gray-700 transition-colors hover:text-black cursor-pointer"
                            >
                                적용
                            </button>
                        </div>
                    </div>
                </details>
            </div>
        </>
    )
};

export default RankingFilter;