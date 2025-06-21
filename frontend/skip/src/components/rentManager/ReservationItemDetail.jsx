import React from "react";
import '../../css/reservationItemList.css';

const ReservationItemDetail = ({ detail }) => {
	return (
		<div className="reservation-item-detail-container">
			<div className="reservation-item-detail-item"><strong className="reservation-item-detail-label">구매자: </strong> {detail.name}</div>
			<div className="reservation-item-detail-item"><strong className="reservation-item-detail-label">이메일: </strong> {detail.userEmail}</div>
			<div className="reservation-item-detail-item"><strong className="reservation-item-detail-label">총 재고 수량:</strong> {detail.totalQuantity}</div>
			<div className="reservation-item-detail-item"><strong className="reservation-item-detail-label">현재 재고:</strong> {detail.stockQuantity}</div>
			<div className="reservation-item-detail-item">
				<strong className="reservation-item-detail-label">대여기간: </strong>
				{new Date(detail.rentStart).toLocaleString()} ~ {" "}
				{new Date(detail.rentEnd).toLocaleString()} ({detail.rentHour}시간)
			</div>
		</div>
	)
}
export default ReservationItemDetail;
