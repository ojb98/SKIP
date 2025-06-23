import axios from 'axios';
import caxios from '../../api/caxios';

// 전체 사용자 조회
export const fetchRents = async () => {
  const response = await caxios.get('/api/rent');
  return response.data;
};
// 전체 사용자 조회 - 대기
export const fetchPendingRents = async () => {
  const response = await caxios.get('/api/rent/pending');
  return response.data;
};
// 전체 사용자 조회 - 거부
export const fetchWithdrawRents = async () => {
  const response = await caxios.get('/api/rent/withdraw');
  return response.data;
};
// 전체 사용자 조회 - 승인
export const fetchApprovalRents = async () => {
  const response = await caxios.get('/api/rent/approval');
  return response.data;
};
// 사용자ID 기준 조회
export const findRentByUserId = async (userid) => {
  const response = await caxios.get(`/api/rent/find/userid/${userid}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};

// 이름 기준 조회
export const findRentByName = async (username) => {
  const response = await caxios.get(`/api/rent/find/username/${username}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};

// 렌탈샵이름 기준 조회
export const findRentByRentName = async (rentname) => {
  const response = await caxios.get(`/api/rent/find/rentname/${rentname}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};

// // 특정 렌탈샵 디테일
// export const findRentDetail = async (userId) => {
//   const response = await axios.get(`/api/rent/find/Detail/${userId}`);
//   return response.data;
// };

// 렌탈샵 승인요청 거부/승인
export const requestUpdate = async (rentId, status) => {
  return await axios.put(`/api/rent/update/${rentId}/${status}`);
};

