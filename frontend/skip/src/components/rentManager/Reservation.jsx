import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { reservListApi } from "../../api/reservationApi";

const Reservation=()=>{
    const [reservations, setReservations] = useState([]);
    const [expandedUid, setExpandedUid] = useState(null);

    // 유저 정보에서 userId 가져오기
    const profile = useSelector(state => state.loginSlice);
    console.log("profile=====>",profile);

    useEffect(() => {
        if (!profile.userId) return;

        const fetchReservations = async () => {
            try {
                const data = await reservListApi(profile.userId);
                setReservations(data);
            } catch (err) {
                console.error("예약 목록 가져오기 실패", err);
            }
        };

        fetchReservations();

    }, [profile.userId]);


    // 행 클릭
    const handleRowClick = (merchantUid) => {
        setExpandedUid((prev) => (prev === merchantUid ? null : merchantUid));
    }

    return (
        <>
        <div>
            <h1>📦 관리자 예약 목록</h1>
            <table className="reserv-table">
                <thead>
                <tr>
                    <th>주문번호</th><th>상호명</th><th>예약자</th><th>상태</th><th>총 금액</th><th>예약일</th>
                </tr>
                </thead>
                <tbody>
                {reservations.map((group) => (
                    <React.Fragment key={group.merchantUid}>
                    <tr onClick={() => handleRowClick(group.merchantUid)}
                        style={{ backgroundColor: expandedUid === group.merchantUid ? "#f0f0f0" : "white" }}
                    >
                        <td>{group.merchantUid}</td>
                        <td>{group.rentName}</td>
                        <td>{group.username}</td>
                        <td>{group.status}</td>
                        <td>{group.totalPrice.toLocaleString()}원</td>
                        <td>{new Date(group.createdAt).toLocaleString()}</td>
                    </tr>

                    {expandedUid === group.merchantUid && (
                        <tr>
                        <td colSpan={7}>
                            <div className="reservation-detail">
                            <h2>📋 예약 상세</h2>
                            <table className="detail-table">
                                <thead>
                                <tr>
                                    <th>예약ID</th><th>장비명</th><th>사이즈</th><th>수량</th><th>대여시작</th><th>반납예정</th>
                                    <th>가격</th><th>장비 반납</th><th>예약취소</th>
                                </tr>
                                </thead>
                                <tbody>
                                {group.items.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.reserveId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.size || "Free"}</td>
                                        <td>{item.quantity}</td>
                                        <td>{new Date(item.rentStart).toLocaleString()}</td>
                                        <td>{new Date(item.rentEnd).toLocaleString()}</td>
                                        <td>{item.price.toLocaleString()}원</td>
                                        <td><button>반납</button></td>
                                        <td><button>취소</button></td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                            </div>
                        </td>
                        </tr>
                    )}
                    </React.Fragment>
                ))}
                </tbody>
            </table>
        </div>
        </>
    )
}
export default Reservation;