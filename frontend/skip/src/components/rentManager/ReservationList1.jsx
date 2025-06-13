import { useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { reservItemReturnApi, reservListApi } from "../../api/reservationApi";
import '../../css/reservList.css';

const ReservationList1=()=>{
    const [reservations, setReservations] = useState([]);
    const [expandedUid, setExpandedUid] = useState(null);

    // 유저 정보에서 userId 가져오기
    const profile = useSelector(state => state.loginSlice);
    console.log("profile=====>",profile);

    // 예약 가져오기
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


    // 행 클릭시 예약상세 보여주기
    const handleRowClick = (merchantUid) => {
        setExpandedUid((prev) => (prev === merchantUid ? null : merchantUid));
    }

    // 장비 반납처리 (현재 상태(reservations)에서 해당 아이템만 반납 상태로 업데이트)
    const handleReturn = async (rentItemId) => {
        if (!window.confirm("정말 반납 처리하시겠습니까?")) return;

        try {
            await reservItemReturnApi(rentItemId);

            setReservations(prevReservations =>
                prevReservations.map(group => ({
                    ...group,
                    items: group.items.map(item =>
                        item.rentItemId === rentItemId
                            ? { ...item, status: "RETURNED" }
                            : item
                    )
                }))
            )

            alert("반납이 완료되었습니다");

        } catch (err) {
            console.error("반납 처리 실패", err);
            alert("반납 처리 중 오류가 발생했습니다.");
        }
    }


    return (
        <>
        <div className="reserv-container">
            <h1 className="top-subject">📦 관리자 예약 목록</h1>
            <table className="reserv-table">
                <thead className="reserv-thead">
                <tr className="reserv-tr">
                    <th>주문번호</th><th>상호명</th><th>예약자</th><th>총 금액</th><th>예약일</th>
                </tr>
                </thead>
                <tbody className="reserv-tbody">
                {reservations.map((group) => (
                    <React.Fragment key={group.merchantUid}>
                    <tr onClick={() => handleRowClick(group.merchantUid)}
                        style={{ backgroundColor: expandedUid === group.merchantUid ? "#d0ebff" : "white" }}
                        className="reserv-tbody-tr">
                        <td>{group.merchantUid}</td>
                        <td>{group.rentName}</td>
                        <td>{group.username}</td>
                        <td>{group.totalPrice.toLocaleString()}원</td>
                        <td>{new Date(group.createdAt).toLocaleString()}</td>
                    </tr>

                    {expandedUid === group.merchantUid && (
                        <tr className="reservation-detail-tr">
                        <td colSpan={7} className="reservation-detail-td">
                            <div className="reservation-detail">
                            <h2 className="sub-subject">📋 예약 상세</h2>
                            <table className="detail-table">
                                <thead className="detail-thead">
                                <tr className="detail-thead-tr">
                                    <th>예약ID</th><th>예약상세ID</th><th>장비명</th><th>사이즈</th><th>수량</th><th>대여일</th><th>반납일</th>
                                    <th>가격</th><th>장비 반납</th>
                                </tr>
                                </thead>
                                <tbody className="detail-tbody">
                                {group.items.map((item, idx) => (
                                    <tr key={idx} className="detail-tbody-tr">
                                        <td>{item.reserveId}</td>
                                        <td>{item.rentItemId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.size || "Free"}</td>
                                        <td>{item.quantity}</td>
                                        <td>{new Date(item.rentStart).toLocaleString()}</td>
                                        <td>{new Date(item.rentEnd).toLocaleString()}</td>
                                        <td>{item.price.toLocaleString()}원</td>
                             
                                        <td>
                                            {item.status === "RETURNED" ? (
                                                <span style={{ color: "green" }} className="return-text">✅완료</span>
                                            ) : (
                                                    <button onClick={() => handleReturn(item.rentItemId)} className="return-btn">반납</button>
                                            )}
                                        </td>
                      
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
export default ReservationList1;