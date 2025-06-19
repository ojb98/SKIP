import { useEffect, useRef, useState } from "react";
import { select } from "../inputs";
import SelectLabel from "../SelectLabel";
import { button, radio } from "../buttons";
import { Check } from "lucide-react";

const today = new Date();
const todayString = today.toISOString().slice(0, 10);
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);
const twoMonthAgo = new Date();
twoMonthAgo.setMonth(today.getMonth() - 2);
const threeMonthAgo = new Date();
threeMonthAgo.setMonth(today.getMonth() - 3);
const sixMonthAgo = new Date();
sixMonthAgo.setMonth(today.getMonth() - 6);

const periodOptions = [
    {
        value: `${oneMonthAgo.toISOString().slice(0, 10)},${todayString}`,
        title: '최근 1개월'
    },

    {
        value: `${twoMonthAgo.toISOString().slice(0, 10)},${todayString}`,
        title: '최근 2개월'
    },

    {
        value: `${threeMonthAgo.toISOString().slice(0, 10)},${todayString}`,
        title: '최근 3개월'
    },

    {
        value: `${sixMonthAgo.toISOString().slice(0, 10)},${todayString}`,
        title: '최근 6개월'
    },

    {
        value: `,${todayString}`,
        title: '전체'
    },

    {
        value: '',
        title: '직접 입력'
    },
];

const RefundSearchFilter = ({ condition, sort, setSort, setAppliedConditions }) => {
    const periodSelectRef = useRef();
    const { from, to } = condition;

    const [datesDisabled, setDatesDisabled] = useState();

    useEffect(() => {
        periodChangeHandler();
        apply();
    }, []);

    const periodChangeHandler = () => {
        if (periodSelectRef.current.value) {
            setDatesDisabled(true);
            const dates = periodSelectRef.current.value.split(',');
            from.current.value = dates[0];
            to.current.value = dates[1];
        } else {
            setDatesDisabled(false);
        }
    };

    const apply = () => {
        setAppliedConditions({
            from: from.current.value,
            to: to.current.value
        });
    };

    return (
        <>
            <div className="w-full flex justify-between">
                <div className="flex items-end">
                    <label htmlFor="latest" className={radio({ color: "secondary-text", className: 'w-20 h-10' })}>
                        <p className="flex items-center gap-1">
                            <span>최신순</span>
                            {
                                sort == 'LATEST'
                                &&
                                <Check size={12}></Check>
                            }
                        </p>

                        <input
                            type="radio"
                            id="latest"
                            name="sort"
                            value="LATEST"
                            defaultChecked
                            onClick={e => setSort(e.target.value)}
                            className="sr-only"
                        ></input>
                    </label>

                    <label htmlFor="oldest" className={radio({ color: "secondary-text", className: 'w-24 h-10' })}>
                        <p className="flex items-center gap-1">
                            <span>오래된 순</span>
                            {
                                sort == 'OLDEST'
                                &&
                                <Check size={12}></Check>
                            }
                        </p>

                        <input
                            type="radio"
                            id="oldest"
                            name="sort"
                            value="OLDEST"
                            onClick={e => setSort(e.target.value)}
                            className="sr-only"
                        ></input>
                    </label>
                </div>

                <ul className="w-110 flex justify-between items-end">
                    <li>
                        <SelectLabel
                            description={"기간"}
                            selectRef={periodSelectRef}
                            options={periodOptions}
                            onChange={periodChangeHandler}
                            className="w-28 h-10"
                        ></SelectLabel>
                    </li>

                    {/* 부터 */}
                    <li>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">시작</span>

                            <input
                                type="date"
                                ref={from}
                                disabled={datesDisabled}
                                className={select({ className: 'w-32 h-10 px-2 ' + (datesDisabled ? 'bg-gray-50 text-gray-500' : '') })}
                            ></input>
                        </div>
                    </li>

                    {/* 까지 */}
                    <li>
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700">끝</span>

                            <input
                                type="date"
                                ref={to}
                                disabled={datesDisabled}
                                className={select({ className: 'w-32 h-10 px-2 ' + (datesDisabled ? 'bg-gray-50 text-gray-500' : '') })}
                            ></input>
                        </div>
                    </li>

                    <li>
                        <button
                            onClick={apply}
                            className={button({ color: "primary", className: 'w-14 h-10 text-sm' })}
                        >
                            적용
                        </button>
                    </li>
                </ul>
            </div>
        </>
    )
};

export default RefundSearchFilter;