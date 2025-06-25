import axios from "axios";
import caxios from "./caxios";

const host = `${__APP_BASE__}/api/qna/reply';

// 답변 저장
export const createReply = async (replyData) => {
  const response = await caxios.post(`${host}`, replyData);
  return response.data;
}

// 조회 (수정/삭제용)
export const getReply = async (qnaId) => {
  const response = await caxios.get(`${host}/${qnaId}`);
  return response.data;
}

// 조회 (화면)
export const getReplySummary = async (qnaId) => {
  const response = await caxios.get(`${host}/${qnaId}/summary`);
  return response.data;
}

// 수정
export const updateReply = async (qnaId, replyData) => {
  const response = await caxios.put(`${host}/${qnaId}`, replyData);
  return response.data;
}

// 삭제
export const deleteReply = async (qnaId, userId) => {
  const response = await caxios.delete(`${host}/${qnaId}`, {
    data: {
      qnaId,
      userId,
    }
  });
  return response.data;
}
