import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ReservationRow from "./ReservationRow";
import { reservListApi } from "../../api/reservationApi";
import { rentIdAndNameApi } from "../../api/rentListApi";

const ReservationList = () => {
	const { userId } = useSelector(state => state.loginSlice);
	const [reservations, setReservations] = useState([]);
	const [expandedRowIds, setExpandedRowIds] = useState([]);
	const [rents, setRents] = useState([]);

	// 필터 상태
	const [filters, setFilters] = useState({
		rentId: '',
		status: '',
		keyword: '',
		rentStart: '',
		rentEnd: '',
	})

	//관리자 - 렌탈샵 목록 
	useEffect(() => {
		const fetchRents = async () => {
			try {
				const data = await rentIdAndNameApi(userId);
				setRents(data);
			} catch (err) {
				console.error("렌탈샵 목록 불러오기 실패", err);
			}
		}
	
		if (userId) fetchRents();
	}, [userId]);
	

	// 필터 input change 핸들러
	const handleFilterChange = (key, value) => {
		setFilters(prev => ({ ...prev, [key]: value }));
	}



	// 필터 적용 후 데이터 불러오기
	const fetchReservations = async () => {
		try {
			const data = await reservListApi(userId, filters);
			setReservations(data);
		} catch (e) {
			alert("예약 목록 불러오기 실패");
		}
	}

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
			
				<div>
					<label>예약구분: </label>
					<select
					value={filters.status}
					onChange={(e) => handleFilterChange("status", e.target.value)}>
						<option value="">전체</option>
						<option value="RESERVED">예약 완료</option>
						<option value="RETURNED">반납 완료</option>
						<option value="PARTIALLY_RETURNED">부분 반납</option>
						<option value="CANCELLED">전체 취소</option>
						<option value="PARTIALLY_CANCELLED">부분 취소</option>
					</select>

					<label>상호명: </label>
					<select value={filters.rentId} onChange={(e) =>
					handleFilterChange("rentId", e.target.value === '' ? '' : Number(e.target.value))}>
						<option value="">전체 상호명</option>
							{rents.map((rent) => (
								<option key={rent.rentId} value={rent.rentId}>
								{rent.name}
								</option>
							))}
					</select>
				</div>

				<div>
				<label>검색창: </label>
				<input type="text" value={filters.keyword || ""}
					onChange={(e) => handleFilterChange("keyword", e.target.value)}
					placeholder="이름 또는 아이디" />
				
				<label>대여일: </label>
				<input type="date" value={filters.rentStart} 
					onChange={(e) => handleFilterChange("rentStart", e.target.value)} />
				<label>반납입: </label>
			
				<input type="date" value={filters.rentEnd} 
					onChange={(e) => handleFilterChange("rentEnd", e.target.value)} />
				
				<button onClick={fetchReservations}>검색</button>
				</div>
			</div>

			<button onClick={() => setExpandedRowIds([])} style={{ marginLeft: "8px" }}>
				전체 닫기
			</button>

			{/* 테이블 출력 */}
			<table border="1" width="100%">
				<thead>
					<tr>
						<th>예약 ID</th><th>아이디</th><th>주문번호</th>
						<th>렌탈샵</th><th>총액</th><th>생성일</th><th>상태</th>
					</tr>
				</thead>
				<tbody>
					{reservations.length === 0 ? (
						<tr>
							<td colSpan="7">데이터 없음</td>
						</tr>
					) : (
						reservations.map(resv => (
							<ReservationRow key={resv.reserveId} reservation={resv}
								expanded={expandedRowIds.includes(resv.reserveId)}
								onToggle={() => {
									setExpandedRowIds(prev =>
										prev.includes(resv.reserveId)
										? prev.filter(id => id !== resv.reserveId)
										: [...prev, resv.reserveId]
									)
								}}
							onReturnSuccess={handleReturnSuccess}/>
						))
					)}
				</tbody>
			</table>
		</div>
	)
}
export default ReservationList;
