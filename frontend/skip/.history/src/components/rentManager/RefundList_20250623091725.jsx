import React, { useEffect, useState } from "react";
import { refundsApproveApi, refundsListApi, refundsRejectApi } from "../../api/refundApi";
import { useSelector } from "react-redux";
import RefundListDetail from "./RefundListDetail";
import { rentIdAndNameApi } from "../../api/rentListApi";
import '../../css/refundList.css';


const RefundList = () => {
    //userId값 꺼내오기
    const profile = useSelector(state => state.loginSlice);
    const userId = profile.userId;
    console.log("profile=====>",profile);

    const [refunds, setRefunds] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedRefundId, setSelectedRefundId] = useState(null);
    const [rents, setRents] = useState([]);

    // 필터 상태 관리 
    const [filters, setFilters] = useState({
        rentId: '',
        status: '',       
        startDate: '',     
        endDate: '',      
        sort: 'DESC',      
    });

    const toggleAccordion = (refundId) => {
        setSelectedRefundId((prev) => (prev === refundId ? null : refundId));
    };

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

    //랜더링 
    useEffect(() => {
        if (userId) {
        fetchRefunds();
        }
    }, [userId]);

    const fetchRefunds = async () => {
        setLoading(true);
        setError(null);

        const rentId =
            filters.rentId !== '' && !isNaN(filters.rentId)? Number(filters.rentId) : undefined;

        const payload = {
            userId,
            rentId,
            status: filters.status || undefined,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            // sort: filters.sort || undefined,
        }

        console.log("filters payload:", payload);

        try {
            const data = await refundsListApi(payload);
            setRefunds(data);
        } catch (err) {
            setError("환불 목록을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 필터 변경 핸들러
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
        ...prev,
        [key]: value,
        }));
    };


    // 승인/거절 처리 
    // 승인 처리 함수 - API 호출 후 목록 다시 불러오기
    const handleApprove = async (refundId) => {

        try {
            setLoading(true);
            await refundsApproveApi(refundId);
            alert("환불 승인 완료");
            fetchRefunds(); // 승인 후 최신 목록 다시 불러오기
        } catch (err) {
            alert("환불 승인 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }

    }

    const handleReject = async (refundId) => {
        try {
            setLoading(true);
            await refundsRejectApi(refundId);
            alert("환불 거절 완료");
            fetchRefunds(); // 거절 후 최신 목록 불러오기
        } catch (err) {
            alert("환불 거절 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    }

    // 상태 한글 변환
    const getStatusLabel = (status) => {
        switch (status) {
            case "REQUESTED": return "환불요청";
            case "COMPLETED": return "환불완료";
            case "REJECTED": return "환불거부";
            default: return status;
        }
    }

    return (
        <div className="refund-list-container">
        <h2 className="refund-top-subject">환불 요청 목록</h2>

        {/* 필터 */}
        <div className="refund-filter-form">
            <div className="refund-filter-row">
                <label>환불구분: </label>
                <select className="refund-filter-select" value={filters.status} onChange={(e) => handleFilterChange('status', e.target.value)}>
                    <option value="">전체 상태</option>
                    <option value="REQUESTED">환불 요청</option>
                    <option value="COMPLETED">환불 완료</option>
                    <option value="REJECTED">환불 거절</option>
                </select>

                <select className="refund-filter-select" value={filters.rentId} onChange={(e) => handleFilterChange("rentId", e.target.value === '' ? '' : Number(e.target.value))}>
                    <option value="">전체 상호명</option>
                        {rents.length > 0 ? (
                            rents.map((rent) => (
                            <option key={rent.rentId} value={rent.rentId}>
                                {rent.name}
                            </option>
                            ))
                        ) : (
                            <option disabled>로딩 중...</option>
                        )}
                </select>
            </div>
            
            <div className="refund-filter-row">
                <label className="refund-filter-label">환불요청일:</label>
                <input className="refund-filter-date" type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} placeholder="시작일"/>
                <span className="refund-filter-separator"><strong>~</strong></span>
                <input className="refund-filter-date" type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} placeholder="종료일"/>
                <button className="refund-filter-button" onClick={fetchRefunds}>검색</button>
            </div>
        </div>

        {loading && <div className="refund-loading-message">불러오는 중...</div>}
        {error && <div className="refund-error-message">{error}</div>}

        {/* 환불 목록 테이블 */}
        <table className="refund-table">
            <thead>
                <tr>
                    <th className="refund-table-header">환불ID</th>
                    <th className="refund-table-header">주문번호</th>
                    <th className="refund-table-header">상호명</th>
                    <th className="refund-table-header">상품명</th>
                    <th className="refund-table-header">수량</th>
                    <th className="refund-table-header">환불금액</th>
                    <th className="refund-table-header">요청일</th>
                    <th className="refund-table-header">상태</th>
                    <th className="refund-table-header">승인</th>
                    <th className="refund-table-header">거부</th>
                </tr>
            </thead>
            <tbody>
                {refunds.length === 0 ? (
                    <tr>
                        <td colSpan="10" className="refund-no-data-message">
                            환불 내역이 없습니다.
                        </td>
                    </tr>
                ) : (
                    refunds.map((refund) => (
                    <React.Fragment key={refund.refundId}>
                        <tr 
                            className={`refund-table-row ${selectedRefundId === refund.refundId ? 'selected' : ''}`}
                            onClick={() => toggleAccordion(refund.refundId)}
                        >
                            <td className="refund-table-cell">{refund.refundId}</td>
                            <td className="refund-table-cell">{refund.merchantUid}</td>
                            <td className="refund-table-cell">{refund.rentName}</td>
                            <td className="refund-table-cell">{refund.itemName}</td>
                            <td className="refund-table-cell">{refund.quantity}</td>
                            <td className="refund-table-cell">{refund.refundPrice.toLocaleString()}원</td>
                            <td className="refund-table-cell">{new Date(refund.createdAt).toLocaleString()}</td>
                            <td className="refund-table-cell">
                                <span className={`refund-status-badge refund-status-${refund.status.toLowerCase()}`}>
                                    {getStatusLabel(refund.status)}
                                </span>
                            </td>
                            <td className="refund-table-cell">
                                <button className="refund-approve-btn"
                                    disabled={refund.status !== "REQUESTED"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(refund.refundId);
                                    }}
                                >
                                    승인
                                </button>
                            </td>
                            <td className="refund-table-cell">
                                <button className="refund-reject-btn"
                                    disabled={refund.status !== "REQUESTED"}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleReject(refund.refundId);
                                    }}
                                >
                                    거부
                                </button>
                            </td>
                        </tr>
                        {selectedRefundId === refund.refundId && (
                        <tr className="refund-table-row-detail">
                            <td colSpan="10">
                                <RefundListDetail refundId={refund.refundId} />
                            </td>
                        </tr>
                        )}
                    </React.Fragment>
                    ))
                )}
            </tbody>
        </table>
        </div>
    )
}
export default RefundList;