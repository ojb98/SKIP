import { useEffect, useState } from "react";
import { refundsDetailApi } from "../../api/refundApi";


const RefundListDetail = ({ refundId }) => {

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await refundsDetailApi(refundId);
                setDetail(data);
            } catch (err) {
                setError("상세 정보를 불러오는데 실패했습니다.");
            } finally {
                setLoading(false);
            }
        }

        fetchDetail();
    }, [refundId]);

    if (loading) return <div className="refund-loading-message">상세 정보 불러오는 중...</div>;
    if (error) return <div className="refund-error-message">{error}</div>;
    if (!detail) return null;

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
        <div className="refund-detail">
            <h4 className="refund-detail-title">
                환불 상세 정보
            </h4>
            <div className="refund-detail-content">
                <p><strong>유저:</strong> {detail.userName}</p>
                <p><strong>이메일:</strong> {detail.userEmail}</p>
                <p><strong>총 결제 금액:</strong> {detail.totalPaymentPrice.toLocaleString()}원</p>
                <p><strong>환불금액:</strong> {detail.refundPrice.toLocaleString()}원</p>
                <p><strong>결제 수단:</strong> {detail.method} ({detail.pgProvider})</p>
                <p><strong>환불 사유:</strong> {detail.reason}</p>
                <p><strong>환불 상태:</strong> 
                    <span className={`refund-status-badge refund-status-${detail.status.toLowerCase()}`} style={{ marginLeft: '8px' }}>
                        {getStatusLabel(detail.status)}
                    </span>
                </p>
                <p><strong>대여 기간:</strong> {new Date(detail.rentStart).toLocaleString()} ~ {new Date(detail.rentEnd).toLocaleString()}</p>
                <p><strong>환불 완료일:</strong> {detail.refundedAt ? new Date(detail.refundedAt).toLocaleString() : "없음"}</p>
            </div>
        </div>
    )
}
export default RefundListDetail;