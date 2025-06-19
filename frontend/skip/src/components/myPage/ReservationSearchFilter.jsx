import { useEffect, useRef, useState } from "react";
import { button } from "../buttons";
import { select } from "../inputs";
import SelectLabel from "../SelectLabel";
import { searchReservations } from "../../api/reservationApi";

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

const paymentStatusOptions = [
    {
        value: '',
        title: '전체'
    },

    {
        value: 'RESERVED',
        title: '예약 완료'
    },

    {
        value: 'RETURNED',
        title: '반납 완료'
    },

    {
        value: 'CANCELLED',
        title: '예약 취소'
    },

    {
        value: 'PARTIALLY_CANCELLED',
        title: '부분 취소'
    }
];

const searchOptions = [
    {
        value: 'RESERVE_ID',
        title: '예약 번호'
    },

    {
        value: 'NAME',
        title: '시설명'
    },

    {
        value: 'ITEM_NAME',
        title: '상품명'
    }
];

const ReservationSearchFilter = ({ conditions, setAppliedConditions }) => {
    const periodSelectRef = useRef();
    const { from, to, status, searchOption, searchKeyword } = conditions;

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
            to: to.current.value,
            status: status.current.value,
            searchOption: searchOption.current.value,
            searchKeyword: searchKeyword.current.value
        });
    };

    return (
        <>
            <ul className="w-full flex justify-between items-end">
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
                    <SelectLabel description={"상태"} selectRef={status} options={paymentStatusOptions} className="w-26 h-10"></SelectLabel>
                </li>

                <li>
                    <SelectLabel description={"검색 조건"} selectRef={searchOption} options={searchOptions} className="w-26 h-10"></SelectLabel>
                </li>

                <li>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">검색어</span>

                        <input
                            ref={searchKeyword}
                            className={select({ className: 'w-40 h-10 px-3' })}
                        ></input>
                    </div>
                </li>

                <li>
                    <button
                        onClick={apply}
                        className={button({ color: "primary", className: 'w-14 h-10 text-sm' })}
                    >
                        조회
                    </button>
                </li>
            </ul>
        </>
    )
};

export default ReservationSearchFilter;