import { useEffect, useRef, useState } from "react";
import ReservationSearchFilter from "../../components/myPage/ReservationSearchFilter";
import MyContainer from "../../components/myPage/MyContainer";
import Pagination from "../../components/myPage/Pagination";
import { searchReservations } from "../../api/reservationApi";
import { Link } from "react-router-dom";
import { button, link } from "../../components/buttons";
import ReturnedBadge from "../../components/myPage/ReturnedBadge";
import ReservedBadge from "../../components/myPage/ReservedBadge";
import PartiallyCancelledBadge from "../../components/myPage/PartiallyCancelledBadge";
import CancelledBadge from "../../components/myPage/CancelledBadge";
import RefundRequestModal from "../../components/myPage/RefundRequestModal";
import { requestRefundApi } from "../../api/refundApi";

const host = __APP_BASE__;

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

const MyReservePage = () => {
    const from = useRef();
    const to = useRef();
    const status = useRef();
    const searchOption = useRef();
    const searchKeyword = useRef();

    const [appliedConditions, setAppliedConditions] = useState({});
    const [reservationsPage, setReservationsPage] = useState({
        content: []
    });

    //환불 모달 상태 추가
    const [showModal, setShowModal] = useState(false);
    const [selectedRentItemId, setSelectedRentItemId] = useState(null);

    useEffect(() => {
        searchHandler(0);
    }, [appliedConditions]);


    const searchHandler = (page = 0) => {
        searchReservations({
            ...appliedConditions,
            page: page
        }).then(res => {
            if (res.success) {
                setReservationsPage(res.data);
                console.log(res.data.content);
            } else {
                console.log(res);
            }
        });

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    //환불 모달창
    const openRefundModal = (rentItemId) => {
        setSelectedRentItemId(rentItemId);
        setShowModal(true);
    };

    const closeRefundModal = () => {
        setShowModal(false);
        setSelectedRentItemId(null);
    };

    const submitRefund = async (reason) => {
        try {
            const result = await requestRefundApi(selectedRentItemId, reason);
            alert(result); // 환불 요청 접수
            closeRefundModal();
            searchHandler(); // 새로고침
        } catch (error) {
            alert("환불 요청 실패");
        }
    }

    return (
        <>
            <h1 className="text-3xl font-bold mb-5">예약 목록</h1>

            <span className="w-full my-3 flex items-center">
                <span className="h-px flex-1 bg-gray-300"></span>
            </span>

            <ReservationSearchFilter conditions={{ from, to, status, searchOption, searchKeyword }} setAppliedConditions={setAppliedConditions}></ReservationSearchFilter>

            <ul className="space-y-10 my-20">
                {
                    reservationsPage.content.length == 0
                    &&
                    <p className="text-lg text-gray-700">조회된 목록이 없습니다.</p>
                    ||
                    reservationsPage.content.map(r => (
                        <li key={r.reserveId}>
                            <MyContainer className="p-5 space-y-5">
                                <div className="flex items-center gap-5">
                                    <span className="text-xl font-semibold">{r.createdAt.split('T')[0]}</span>

                                    <Link
                                        to={`/rent/detail/${r.rentId}`}
                                        className={link({ className: 'text-lg' })}
                                    >{r.rentName}</Link>

                                    <span className="flex items-center gap-1">
                                        <span className="text-sm text-gray-500">총합</span>

                                        <span>{r.totalPrice.toLocaleString()}원</span>
                                    </span>

                                    {
                                        r.status == 'RESERVED'
                                        &&
                                        <ReservedBadge>예약 완료</ReservedBadge>
                                        ||
                                        r.status == 'RETURNED'
                                        &&
                                        <ReturnedBadge>반납 완료</ReturnedBadge>
                                        ||
                                        r.status == 'PARTIALLY_CANCELLED'
                                        &&
                                        <PartiallyCancelledBadge>부분 환불</PartiallyCancelledBadge>
                                        ||
                                        r.status == 'CANCELLED'
                                        &&
                                        <CancelledBadge>환불</CancelledBadge>
                                    }
                                </div>

                                <ul className="space-y-5">
                                    {
                                        r.reservationItems.map(i => (
                                            <li
                                                key={i.rentItemId}
                                                className="w-full h-40 flex border rounded-xl divide-x divide-gray-200 border-gray-200"
                                            >
                                                <div className="w-[75%] grid grid-cols-3 justify-center items-center place-items-center">
                                                    <img src={host + i.itemImage} className="w-30 h-30"></img>

                                                    <div className="col-span-2 grid grid-rows-3 gap-5">
                                                        <span>
                                                            {
                                                                i.isReturned
                                                                &&
                                                                <ReturnedBadge>반납 완료</ReturnedBadge>
                                                                ||
                                                                <ReservedBadge>대여중</ReservedBadge>
                                                            }
                                                        </span>

                                                        <div className="space-x-5 text-lg">
                                                            <span>{itemCategoryMapper[i.itemCategory]} {i.itemName},</span>
                                                            <span className="text-gray-600">{i.subtotalPrice.toLocaleString()}원 · {i.quantity}</span>
                                                        </div>

                                                        <span className="text-sm font-semibold">{i.rentStart.split('T')[0]} {i.rentStart.split('T')[1].substring(0, 5)} - {i.rentEnd.split('T')[0]} {i.rentEnd.split('T')[1].substring(0, 5)}</span>
                                                    </div>
                                                </div>

                                                <div className="w-[25%] flex flex-col justify-evenly items-center">
                                                    <button
                                                        type="button"
                                                        className={button({ color: "primary-outline", className: 'w-36 h-10' })}
                                                    >
                                                        리뷰 쓰기
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => openRefundModal(i.rentItemId)}
                                                        className={button({ color: "secondary-outline", className: 'w-36 h-10' })}
                                                    >
                                                        환불 신청
                                                    </button>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </MyContainer>
                        </li>
                    ))
                }
            </ul>

            <Pagination pageNumber={reservationsPage.number} totalPages={reservationsPage.totalPages} searchHandler={searchHandler}></Pagination>
        
            {showModal && (
                <RefundRequestModal onClose={closeRefundModal} onSubmit={submitRefund}/>
            )}
        </>
    )
};

export default MyReservePage;