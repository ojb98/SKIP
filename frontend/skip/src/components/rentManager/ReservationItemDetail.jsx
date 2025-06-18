import React from "react";

const ReservationItemDetail = ({ detail }) => {
	return (
		<div>
			<div><strong>구매자: </strong> {detail.name}</div>
			<div><strong>이메일: </strong> {detail.userEmail}</div>
			<div><strong>총 재고 수량:</strong> {detail.totalQuantity}</div>
			<div><strong>현재 재고:</strong> {detail.stockQuantity}</div>
			<div>
				<strong>대여기간: </strong>
				{new Date(detail.rentStart).toLocaleString()} ~ {" "}
				{new Date(detail.rentEnd).toLocaleString()} ({detail.rentHour}시간)
			</div>
		</div>
	)
}
export default ReservationItemDetail;
