import { useEffect, useRef, useState } from "react";
import Pagination from "../../components/myPage/Pagination";
import RefundSearchFilter from "../../components/myPage/RefundSearchFilter";
import { searchRefunds } from "../../api/refundApi";
import ReservedBadge from "../../components/myPage/ReservedBadge";
import CancelledBadge from "../../components/myPage/CancelledBadge";
import PartiallyCancelledBadge from "../../components/myPage/PartiallyCancelledBadge";
import FailedBadge from "../../components/myPage/FailedBadge";

const itemCategoryMapper = {
    "LIFT_TICKET": "리프트권",
    "PACKAGE": "패키지",
    "SKI": "스키",
    "SNOWBOARD": "보드",
    "PROTECTIVE_GEAR": "보호구",
    "TOP": "상의",
    "BOTTOM": "하의",
    "BOOTS": "신발"
};

const MyRefundPage = () => {
    const from = useRef();
    const to = useRef();

    const [sort, setSort] = useState("LATEST");
    const [appliedConditions, setAppliedConditions] = useState({});
    const [refundsPage, setRefundsPage] = useState({
        content: []
    });

    useEffect(() => {
        searchHandler(0);
    }, [sort, appliedConditions]);


    const searchHandler = (page = 0) => {
        searchRefunds({
            ...appliedConditions,
            sort: sort,
            page: 0
        }).then(res => {
            if (res.success) {
                setRefundsPage(res.data);
            }
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-5">환불 내역</h1>

            <span className="w-full my-3 flex items-center">
                <span className="h-px flex-1 bg-gray-300"></span>
            </span>

            <RefundSearchFilter condition={{ from, to }} sort={sort} setSort={setSort} setAppliedConditions={setAppliedConditions}></RefundSearchFilter>

            <ul className="space-y-10 my-20">
                {
                    refundsPage.content.length == 0
                    &&
                    <p className="text-lg text-gray-700">조회된 목록이 없습니다.</p>
                    ||
                    refundsPage.content.map(r => (
                        <li key={r.refundId}>
                            <div className="flow-root">
                                <dl className="divide-y divide-gray-200 rounded-xl border border-gray-200 shadow-sm text-sm">
                                    <div className="grid p-3 grid-cols-3 gap-4">
                                        <dt className="font-medium text-gray-900">예약 번호</dt>

                                        <dd className="text-gray-700 sm:col-span-2">{r.reserveId}</dd>
                                    </div>

                                    <div className="grid p-3 grid-cols-3 gap-4">
                                        <dt className="font-medium text-gray-900">상품명</dt>

                                        <dd className="text-gray-700 sm:col-span-2">{itemCategoryMapper[r.category]} {r.name} {r.size}</dd>
                                    </div>

                                    <div className="grid p-3 grid-cols-3 gap-4">
                                        <dt className="font-medium text-gray-900">가격/수량</dt>

                                        <dd className="text-gray-700 col-span-2">{r.subtotalPrice.toLocaleString()}원 · {r.quantity}개</dd>
                                    </div>

                                    <div className="grid p-3 grid-cols-3 gap-4">
                                        <dt className="font-medium text-gray-900">상태</dt>

                                        <dd className="text-gray-700 col-span-2">
                                            {
                                                r.status == 'REQUESTED'
                                                &&
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold">{r.createdAt.split('T')[0]} {r.createdAt.split('T')[1].substring(0, 8)}</span>
                                                    <ReservedBadge>접수됨</ReservedBadge>
                                                </div>
                                                ||
                                                r.status == 'COMPLETED'
                                                &&
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold">{r.refundedAt.split('T')[0]} {r.refundedAt.split('T')[1].substring(0, 8)}</span>
                                                    <PartiallyCancelledBadge>환불됨</PartiallyCancelledBadge>
                                                </div>
                                                ||
                                                r.status == 'REJECTED'
                                                &&
                                                <div className="flex items-center gap-3">
                                                    <span className="font-semibold">{r.refundedAt.split('T')[0]} {r.refundedAt.split('T')[1].substring(0, 8)}</span>
                                                    <FailedBadge>반려됨</FailedBadge>
                                                </div>
                                            }
                                        </dd>
                                    </div>

                                    <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                                        <dt className="font-medium text-gray-900">환불 사유</dt>

                                        <dd className="text-gray-700 sm:col-span-2">{r.reason}</dd>
                                    </div>
                                </dl>
                            </div>
                        </li>
                    ))
                }
            </ul>

            <Pagination pageNumber={refundsPage.number} totalPages={refundsPage.totalPages} searchHandler={searchHandler}></Pagination>
        </>
    )
};

export default MyRefundPage;