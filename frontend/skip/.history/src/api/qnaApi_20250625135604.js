import axios from "axios"
import caxios from "./caxios";

const host = `${__APP_BASE__}`/api/qna';

// Q&A 등록
export const createQnaApi = async (userId, qnaData) => {
  const response = await caxios.post(`${host}?userId=${userId}`, qnaData);
  return response.data;
}

// Q&A 수정
export const updateQnaApi = async (qnaId, userId, qnaData) => {
  const response = await caxios.put(`${host}/${qnaId}?userId=${userId}`, qnaData)
  return response.data;
}

// Q&A 삭제 (사용자)
export const deleteQnaByUserApi = async (qnaId, userId) => {
  const response = await caxios.delete(`${host}/${qnaId}?userId=${userId}`)
  return response.data;
}

// Q&A 삭제 (관리자)
export const deleteQnaByAdminApi = async (qnaId, rentId) => {
  const response = await caxios.delete(`${host}/admin/${qnaId}?rentId=${rentId}`)
  return response.data;
}

// 아이템 페이지 Q&A 리스트
export const getQnaListByItemApi = async (itemId, hasReply, status, secret, currentUserId, page, size = 10) => {
  const response = await caxios.get(`${host}/item/${itemId}`, {
    params: {hasReply, status, secret, currentUserId, page, size}
  })
  return response.data
}

// 관리자 페이지 Q&A 리스트
export const getQnaListByAdminApi = async (rentId, status, username, itemName, secret, hasReply, page = 0, size = 10) => {
  const response = await caxios.get(`${host}/admin/rent/${rentId}`, {
    params: {status, username, itemName, secret, hasReply, page, size},
  });
  return response.data;
}

// 관리자 페이지 Q&A 미답변 개수
export const getUnansweredCountApi = async (rentId) => {
  const response = await caxios.get(`${host}/admin/rent/${rentId}/unansweredCount`);
  return response.data;
}

// 마이페이지 Q&A 리스트
export const getQnaListByUserApi = async (userId, hasReply, startDate, page = 0, size = 5) => {
  const response = await caxios.get(`${host}/user`, {
    params: { userId, hasReply, startDate, page, size },
  });
  return response.data;
}

// Q&A 단건 조회
export const getQnaDetailApi = async (qnaId) => {
  const response = await caxios.get(`${host}/${qnaId}`);
  return response.data;
}

