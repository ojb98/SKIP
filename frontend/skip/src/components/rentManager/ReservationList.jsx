import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReservationRow from "./ReservationRow";
import { reservListApi } from "../../api/reservationApi";

const ReservationList = () => {
  const { userId } = useSelector(state => state.loginSlice);
  const [reservations, setReservations] = useState([]);
  const [expandedRowIds, setExpandedRowIds] = useState([]);

  // 필터 상태
  const [filters, setFilters] = useState({
    rentId: '',
    status: '',
    username: '',
    name:'',
    startDate: '',
    endDate: '',
    sort: 'DESC',
  });

  // 필터 input change 핸들러
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 필터 적용 후 데이터 불러오기
  const fetchReservations = async () => {
    try {
      const data = await reservListApi(userId, filters);
      setReservations(data);
    } catch (e) {
      alert("예약 목록 불러오기 실패");
    }
  };

  const handleReturnSuccess = () => {
    fetchReservations(); 
  }

  useEffect(() => {
    if (userId) fetchReservations();
  }, [userId]);


  return (
    <div>
      <h2>예약 목록</h2>

      {/* 필터 영역 */}
      <div style={{ marginBottom: "1rem" }}>

        <input
            type="text"
            placeholder="고객이름 또는 아이디 또는 이메일"
            value={filters.keyword || ""}
            onChange={(e) => handleFilterChange("keyword", e.target.value)}
            />

        <select
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="">전체</option>
            <option value="RESERVED">예약 완료</option>
            <option value="RETURNED">반납 완료</option>
            <option value="CANCELLED">전체 취소</option>
            <option value="PARTIALLY_CANCELLED">부분 취소</option>

          {/* 필요한 예약 상태 추가 */}
        </select>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
        />
        <select
          value={filters.sort}
          onChange={(e) => handleFilterChange("sort", e.target.value)}
        >
          <option value="DESC">최신순</option>
          <option value="ASC">오래된순</option>
        </select>
        <button onClick={fetchReservations}>검색</button>
      </div>

        <button onClick={() => setExpandedRowIds([])} style={{ marginLeft: "8px" }}>
          전체 닫기
        </button>

      {/* 테이블 출력 */}
      <table border="1" width="100%">
        <thead>
          <tr>
            <th>예약 ID</th><th>아이디</th><th>주문번호</th><th>렌탈샵</th><th>총액</th><th>생성일</th><th>상태</th>
          </tr>
        </thead>
        <tbody>
          {reservations.length === 0 ? (
            <tr>
              <td colSpan="7">데이터 없음</td>
            </tr>
          ) : (
            reservations.map(resv => (
              <ReservationRow
                key={resv.reserveId}
                reservation={resv}
                expanded={expandedRowIds.includes(resv.reserveId)}
                onToggle={() => {
                  setExpandedRowIds(prev =>
                    prev.includes(resv.reserveId)
                      ? prev.filter(id => id !== resv.reserveId)
                      : [...prev, resv.reserveId]
                  );
                }}
                onReturnSuccess={handleReturnSuccess}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationList;
