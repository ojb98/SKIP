import { useEffect, useState } from "react";
import { button } from "../buttons";
import { select } from "../inputs";
import SelectLabel from "../SelectLabel";


const periodOptions = [
    {
        value: '',
        title: '최근 1개월'
    },
    {
        value: '',
        title: '최근 2개월'
    },
    {
        value: '',
        title: '최근 3개월'
    },
    {
        value: '',
        title: '최근 6개월'
    },
    {
        value: '',
        title: '전체'
    },
];

const paymentStatusOptions = [
    {
        value: '',
        title: '결제 완료'
    },
    {
        value: '',
        title: '결제 취소'
    }
];

const searchOptions = [
    {
        value: '',
        title: '결제 번호'
    },
    {
        value: '',
        title: '상품명'
    }
];

const PaymentSearchFilter = () => {
    

    return (
        <>
            <div className="flex justify-between">
                <ul className="flex gap-5">
                    <li>
                        <SelectLabel description={"조회 기간"} options={periodOptions} className="w-35 h-10"></SelectLabel>
                    </li>

                    <li>
                        <SelectLabel description={"상태"} options={paymentStatusOptions} className="w-30 h-10"></SelectLabel>
                    </li>

                    <li>
                        <SelectLabel description={"검색 조건"} options={searchOptions} className="w-30 h-10"></SelectLabel>
                    </li>
                </ul>
                
                <div className="w-fit">
                    <span className="text-sm font-medium text-gray-700">검색어</span>

                    <div className="flex gap-2">
                        <input
                            className={select({ className: 'w-60 h-10 px-3' })}
                        ></input>

                        <button
                            className={button({ color: "primary", className: 'w-15 h-10 text-sm' })}
                        >
                            조회
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
};

export default PaymentSearchFilter;