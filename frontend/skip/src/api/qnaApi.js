import axios from "axios"

const host = 'http://localhost:8080/api/qna'

// Q&A 등록
export const createQnaApi = async (userId, qnaData) => {
  const response = await axios.post(`${host}?userId=${userId}`, qnaData);
  return response.data;
}

// Q&A 수정
export const updateQnaApi = async (qnaId, userId, qnaData) => {
  const response = await axios.put(`${host}?userId=${userId}`, qnaData)
  return response.data;
}

// Q&A 삭제 (사용자)
export const deleteQnaByUserApi = async (qnaId, userId) => {
  const response = await axios.delete(`${host}/${qnaId}?userId=${userId}`)
  return response.data;
}

// Q&A 삭제 (관리자)
export const deleteQnaByAdminApi = async (qnaId, rentId) => {
  const response = await axios.delete(`${host}/admin/${qnaId}?rentId=${rentId}`)
  return response.data;
}

// 아이템 페이지 Q&A 리스트
export const getQnaListByItemApi = async (itemId, status, secret, page = 0, size = 10) => {
  const response = await axios.get(`${host}/item/${itemId}`, {
    params: {status, secret, page, size, sort: "createdAt,DESC"},
  });
  return response.data;
}

// 마이페이지 Q&A 리스트
export const getQnaListByUserApi = async (userId, status, secret, page = 0, size = 10) => {
  const response = await axios.get(`${host}/user/${userId}`, {
    params: {status, secret, page, size, sort: "createdAt,DESC"},
  });
  return response.data;
}

// 관리자 페이지 Q&A 리스트
export const getQnaListByAdminApi = async (rentId, status, username, secret, page = 0, size = 10) => {
  const response = await axios.get(`${host}/admin/rent/${rentId}`, {
    params: {status, username, secret, page, size, sort: "createdAt,DESC"},
  });
  return response.data;
}

