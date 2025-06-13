import axios from 'axios';

const host = 'http://localhost:8080/api/refunds';

/**
 * 관리자 환불 요청 목록 조회 API
 * @param {Object} filters - 필터링 조건
 * @param {string} [filters.status] - 환불 상태 (예: REQUESTED, APPROVED)
 * @param {string} [filters.startDate] - 시작 날짜 (YYYY-MM-DD)
 * @param {string} [filters.endDate] - 종료 날짜 (YYYY-MM-DD)
 * @param {string} [filters.sort] - 정렬 방식 (ASC 또는 DESC)
 */

export const refundsListApi = async ({ status, startDate, endDate, sort }) => {
  const params = new URLSearchParams();

  if (status) params.append('status', status);
  if (startDate) params.append('startDate', new Date(startDate).toISOString());
  if (endDate) params.append('endDate', new Date(endDate).toISOString());
  if (sort) params.append('sort', sort);

  try {
    const response = await axios.get(`${host}/manager`, { params });
    return response.data;
  } catch (error) {
    console.error('환불 요청 목록 조회 실패:', error);
    throw error; // 호출한 쪽에서 try/catch 처리
  }
};