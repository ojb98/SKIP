import axios from 'axios';

// 전체 사용자 조회
export const fetchUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};

// 사용자명 기준 조회
export const findUsersByUsername = async (username) => {
  const response = await axios.get(`/api/users/find/username/${username}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};

// 이름 기준 조회
export const findUsersByName = async (name) => {
  const response = await axios.get(`/api/users/find/name/${name}`);
  return Array.isArray(response.data) ? response.data : [response.data];
};

// 특정 유저 최근 활동(리뷰 + 결제 내역)
export const findUser5Activity = async (userId) => {
  const response = await axios.get(`/api/users/find/recent/activity/${userId}`);
  return response.data;
};

// 사용자 탈퇴 요청
export const requestDelete = async (userId) => {
  return await axios.delete(`/api/users/delete/${userId}`);
};
