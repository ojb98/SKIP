const ReservationDetail = ({ reservation, onReturn }) => {

  return (
    <div className="reservation-detail">
      <h2 className="sub-subject">📋 예약 상세</h2>
      <table className="detail-table">
        <thead className="detail-thead">
          <tr className="detail-thead-tr">
            <th>예약ID</th>
            <th>예약상세ID</th>
            <th>장비명</th>
            <th>사이즈</th>
            <th>수량</th>
            <th>대여일</th>
            <th>반납일</th>
            <th>가격</th>
            <th>장비 반납</th>
          </tr>
        </thead>
        <tbody className="detail-tbody">
          {reservation.items.map((item, idx) => (
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
                {item.returned ? (
                <span style={{ color: "green" }} className="return-text">✅완료</span>
                ) : (
                <button onClick={() => onReturn(item.rentItemId)} className="return-btn" disabled={item.isReturned}>
                    반납하기
                </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationDetail;
