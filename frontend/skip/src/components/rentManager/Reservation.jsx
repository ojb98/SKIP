import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { reservListApi, reservItemReturnApi } from "../../api/reservationApi";
import ReservationList from "./ReservationList";
import ReservFilterBar from "./ReservFilterBar";
import ReservationDetail from "./ReservationDetail";

const Reservation = () => {
  const profile = useSelector(state => state.loginSlice);
  const adminId = profile.userId;

  // 필터는 예약자 이름(username)과 반납일(returnDate)만 관리
  const [filters, setFilters] = useState({ username: "", returnDate: null });
  const [reservations, setReservations] = useState([]);
  const [selectedMerchantUid, setSelectedMerchantUid] = useState(null);

    // 예약 목록 API 호출
    useEffect(() => {
        if (!adminId) return;

        const fetchData = async () => {
            try {
                // adminId와 filters 객체를 넘김
                const data = await reservListApi(adminId, filters);
                console.log("reserveDate",data);
                setReservations(data);
                setSelectedMerchantUid(null);  // 필터 변경시 선택 초기화
            } catch (err) {
                console.error("예약 목록 가져오기 실패", err);
            }
        };

        fetchData();
    }, [adminId, filters]);

    // 반납 처리 함수
    const handleReturn = async (rentItemId) => {
        if (!window.confirm("정말 반납 처리하시겠습니까?")) return;

        try {
            await reservItemReturnApi(rentItemId);
            setReservations(prev =>
                prev.map(group => ({
                    ...group,
                    items: group.items.map(item =>
                    item.rentItemId === rentItemId
                        ? { ...item, returned : true, status: "RETURNED" } 
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

    
    const selectedReservation = useMemo(() => {
        return reservations.find(r => r.merchantUid === selectedMerchantUid);
    }, [reservations, selectedMerchantUid]);

    return (
        <div className="reserv-container">
        <h1 className="top-subject">📦 관리자 예약 목록</h1>

        <ReservFilterBar filters={filters} setFilters={setFilters} />

        <ReservationList
            reservations={reservations}
            selectedMerchantUid={selectedMerchantUid}
            setSelectedMerchantUid={setSelectedMerchantUid}
        />

        {selectedReservation && (
            <ReservationDetail reservation={selectedReservation} onReturn={handleReturn} />
        )}
        </div>
    )
}

export default Reservation;