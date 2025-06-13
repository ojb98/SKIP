const ReservationList = ({ reservations, selectedMerchantUid, setSelectedMerchantUid }) => {

    const handleRowClick = (merchantUid) => {
        setSelectedMerchantUid(prev => (prev === merchantUid ? null : merchantUid));
    };

    function getStatusKor(status) {
        const map = {
            RESERVED: "예약 완료",
            RETURNED: "반납 완료",
            CANCELLED: "예약 취소"
        };
        return map[status] || "알 수 없음";
    }

  return (
    <table className="reserv-table">
      <thead className="reserv-thead">
        <tr className="reserv-tr">
          <th>주문번호</th>
          <th>상호명</th>
          <th>예약자</th>
          <th>총 금액</th>
          <th>예약일</th>
          <th>예약상태</th>
        </tr>
      </thead>
      <tbody className="reserv-tbody">
        {reservations.map(group => (
          <tr
            key={group.merchantUid}
            onClick={() => handleRowClick(group.merchantUid)}
            style={{ backgroundColor: selectedMerchantUid === group.merchantUid ? "#d0ebff" : "white" }}
            className="reserv-tbody-tr"
          >
            <td>{group.merchantUid}</td>
            <td>{group.rentName}</td>
            <td>{group.username}</td>
            <td>{group.totalPrice.toLocaleString()}원</td>
            <td>{new Date(group.createdAt).toLocaleString()}</td>
            <td>{getStatusKor(group.status)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ReservationList;
