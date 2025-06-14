import React, { useState } from "react";
import ReservationItemDetail from "./ReservationItemDetail";
import { reservDetailApi, reservItemReturnApi } from "../../api/reservationApi";

const ReservationItemRow = ({ item, onReturnSuccess }) => {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [isReturned, setIsReturned] = useState(item.isReturned); 

  const handleRowClick = async () => {
    if (!expanded && !detail) {
      try {
        const res = await reservDetailApi(item.rentItemId);
        setDetail(res);
      } catch {
        alert("상세 정보를 불러오지 못했습니다.");
      }
    }
    setExpanded(prev => !prev);
  };

  const handleReturnClick = async (e) => {
    e.stopPropagation(); // row 클릭 이벤트 막기
    if (isReturned) {
      alert("이미 반납된 항목입니다.");
      return;
    }

    const confirm = window.confirm("정말로 반납 처리하시겠습니까?");
    if (!confirm) return;

    try {
      await reservItemReturnApi(item.rentItemId);
      setIsReturned(true);
      alert("반납 처리되었습니다.");

      if (onReturnSuccess) {
            onReturnSuccess();  
      }
      
    } catch {
      alert("반납 처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <tr style={{ cursor: "pointer", backgroundColor: "#fff" }} onClick={handleRowClick}>
        <td>{item.rentItemId}</td>
        <td>{item.itemName}</td>
        <td>{item.size}</td>
        <td>{item.quantity}</td>
        <td>{item.subtotalPrice.toLocaleString()}원</td>
        <td>{item.returned ? "✔️" : "❌" }</td>
        <td>
          <button onClick={handleReturnClick} disabled={item.returned}>
            {item.returned ? "반납 완료" : "반납하기"}
          </button>
        </td>
      </tr>

      {expanded && detail && (
        <tr>
          <td colSpan="7">
            <ReservationItemDetail detail={detail} />
          </td>
        </tr>
      )}
    </>
  );
};

export default ReservationItemRow;
