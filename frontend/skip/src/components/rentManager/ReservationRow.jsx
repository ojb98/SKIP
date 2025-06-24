import React, { useState } from "react";
import ReservationItemRow from "./ReservationItemRow";

const ReservationRow = ({ reservation, expanded, onToggle, onReturnSuccess}) => {


    const getStatusLabel = (status) => {
        switch (status) {
            case "RESERVED": return "예약 완료";
            case "RETURNED": return "반납 완료";
			case "PARTIALLY_RETURNED": return "부분 반납";
            case "CANCELLED": return "전체 취소";
            case "PARTIALLY_CANCELLED": return "부분 취소";
            default: return status;
        }
    }

  	return (
    	<>
		<tr className={`reservation-main-row ${expanded ? 'reservation-main-row-expanded' : ''}`} onClick={onToggle}>
			<td className="reservation-main-cell">{reservation.reserveId}</td>
			<td className="reservation-main-cell">{reservation.username}</td>
			<td className="reservation-main-cell">{reservation.merchantUid}</td>
			<td className="reservation-main-cell">{reservation.rentName}</td>
			<td className="reservation-main-cell">{reservation.totalPrice.toLocaleString()}원</td>
			<td className="reservation-main-cell">{new Date(reservation.createdAt).toLocaleString()}</td>
			<td className="reservation-main-cell">
				<span className={`reservation-status-badge reservation-status-${reservation.status.toLowerCase()}`}>
					{getStatusLabel(reservation.status)}
				</span>
			</td>
		</tr>

		{expanded && (
			<tr className="reservation-detail-row">
				<td colSpan="7" className="reservation-detail-cell">
					<div className="reservation-detail-container">

					<strong className="reservation-detail-title">예약 리스트</strong>
					<table className="reservation-item-table">
						<thead>
							<tr className="reservation-item-header-row">
								<th className="reservation-item-header">상세ID</th>
								<th className="reservation-item-header">상품명</th>
								<th className="reservation-item-header">사이즈</th>
								<th className="reservation-item-header">수량</th>
								<th className="reservation-item-header">소계</th>
								<th className="reservation-item-header">반납여부</th>
								<th className="reservation-item-header">장비 반납</th>
							</tr>
						</thead>
						<tbody>
							{reservation.items.map(item => (
							<ReservationItemRow key={item.rentItemId}
							item={item} onReturnSuccess={onReturnSuccess}/>
							))}
						</tbody>
					</table>
					</div>
				</td>
			</tr>
		)}
    	</>
	)
}
export default ReservationRow;