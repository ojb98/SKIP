import React, { useState } from "react";
import ReservationItemRow from "./ReservationItemRow";

const ReservationRow = ({ reservation, expanded, onToggle, onReturnSuccess}) => {


    const getStatusLabel = (status) => {
        switch (status) {
            case "RESERVED": return "예약 완료";
            case "RETURNED": return "반납 완료";
            case "CANCELLED": return "전체 취소";
            case "PARTIALLY_CANCELLED": return "부분 취소";
            default: return status;
        }
    }

  return (
    <>
      <tr onClick={onToggle} style={{ cursor: "pointer", backgroundColor: expanded ? "#eef7ff" : "white" }}>
        <td>{reservation.reserveId}</td>
        <td>{reservation.username}</td>
        <td>{reservation.merchantUid}</td>
        <td>{reservation.rentName}</td>
        <td>{reservation.totalPrice.toLocaleString()}원</td>
        <td>{new Date(reservation.createdAt).toLocaleString()}</td>
        <td>{getStatusLabel(reservation.status)}</td>
      </tr>

      {expanded && (
        <tr>
          <td colSpan="7">
            <div
              style={{
                border: "1px solid #ccc",
                padding: "12px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
              }}
            >
              <strong>예약 리스트</strong>
              <table style={{ width: "100%", marginTop: "10px", fontSize: "14px" }}>
                <thead>
                  <tr style={{ textAlign: "left" }}>
                    <th>상세ID</th>
                    <th>상품명</th>
                    <th>사이즈</th>
                    <th>수량</th>
                    <th>소계</th>
                    <th>반납여부</th>
                    <th>장비 반납</th>
                  </tr>
                </thead>
                <tbody>
                  {reservation.items.map(item => (
                    <ReservationItemRow
                      key={item.rentItemId}
                      item={item}
                      onReturnSuccess={onReturnSuccess}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ReservationRow;