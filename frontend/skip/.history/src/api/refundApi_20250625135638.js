import axios from 'axios';
import caxios from './caxios';

const host = '`${__APP_BASE__}/api/refunds';

/**
    * 관리자 환불 요청 목록 조회 API
    * @param {Object} filters - 필터링 조건
    * @param {string} filters.userId - 관리자 ID (필수)
    * @param {string} [filters.status] - 환불 상태 (예: REQUESTED, APPROVED)
    * @param {string} [filters.startDate] - 시작 날짜 (YYYY-MM-DD)
    * @param {string} [filters.endDate] - 종료 날짜 (YYYY-MM-DD)
    * @param {string} [filters.sort] - 정렬 방식 (ASC 또는 DESC)
*/

//환불항목
export const refundsListApi = async ({ userId, rentId, status, startDate, endDate, sort }) => {
    const params = new URLSearchParams();

    if (!userId) {
        throw new Error('userId (관리자 ID)는 필수입니다.');
    }

    if (rentId) params.append('rentId', rentId);
    if (status) params.append('status', status);
    if (startDate) params.append('startDate', new Date(startDate).toISOString());
    if (endDate) params.append('endDate', new Date(endDate).toISOString());
    if (sort) params.append('sort', sort);

    try {
        const response = await caxios.get(`${host}/manager/${userId}`, { params });
        return response.data;
    } catch (error) {
        console.error('환불 요청 목록 조회 실패:', error);
        throw error; // 호출한 쪽에서 try/catch 처리
    }
}

//환불상세
export const refundsDetailApi= async(refundId)=>{
    const data = await caxios.get(`${host}/${refundId}/detail`).then(res=>{
        console.log("환불 상세 ==>", res);
        return res.data;
    });
    return data;
}

//환불승인
export const refundsApproveApi = async(refundId)=>{
    const data = await caxios.patch(`${host}/manager/${refundId}/approve`).then(res=>{
        console.log("환불 승인 ==>", res);
        return res.data;
    });
    return data;
}

//환불거절
export const refundsRejectApi = async(refundId)=>{
    const data = await caxios.patch(`${host}/manager/${refundId}/reject`).then(res=>{
        console.log("환불 거절 ==>", res);
        return res.data;
    });
    return data;
}

// 마이페이지 환불 내역 조회
export const searchRefunds = async req => {
    const data = await caxios.get(`${host}/search`, {params: {
        from: req.from,
        to: req.to,
        sort: req.sort,
        page: req.page
    }}).then(res => {
        return res.data;
    });

    return data;
};

// 사용자 환불요청 
export const requestRefundApi = async (rentItemId, reason) => {
    try {
        const resp = await caxios.post(`${host}/request/${rentItemId}`, {
            reason,
        });
        return resp.data; 

    } catch (error) {
        console.error("환불 요청 실패:", error);
        throw error;
    }
}
