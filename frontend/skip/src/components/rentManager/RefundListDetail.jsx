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

    if (loading) return <p>상세 정보 불러오는 중...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
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
        <div style={{ padding: 10, backgroundColor: "#f9f9f9" }}>
        <p><strong>유저:</strong> {detail.userName}</p>
        <p><strong>이메일:</strong> {detail.userEmail}</p>
        <p><strong>환불금액:</strong> {detail.refundPrice.toLocaleString()}원</p>
        <p><strong>관리자 환불:</strong> {detail.adminRefundPrice.toLocaleString()}원</p>
        <p><strong>렌트 환불:</strong> {detail.rentRefundPrice.toLocaleString()}원</p>
        <p><strong>환불 사유:</strong> {detail.reason}</p>
        <p><strong>환불 상태:</strong> {getStatusLabel(detail.status)}</p>
        <p><strong>환불 완료일:</strong> {detail.refundedAt ? new Date(detail.refundedAt).toLocaleString() : "없음"}</p>
        <p><strong>총 결제 금액:</strong> {detail.totalPaymentPrice.toLocaleString()}원</p>
        <p><strong>대여 기간:</strong> {new Date(detail.rentStart).toLocaleString()} ~ {new Date(detail.rentEnd).toLocaleString()}</p>
        </div>
    )
}
export default RefundListDetail;