import axios from "axios";

const host = 'http://localhost:8080/api/qna/reply';

// 답변 저장
export const createReply = async (replyData) => {
  const response = await axios.post(`${host}`, replyData);
  return response.data;
}

// 조회 (수정/삭제)
export const getReply = async (qnaId) => {
  const response = await axios.get(`${host}/${qnaId}`);
  return response.data;
}

// 조회 (화면)
export const getReplySummary = async (qnaId) => {
  const response = await axios.get(`${host}/${qnaId}/summary`);
  return response.data;
}

// 수정
export const updateReply = async (qnaId, updatedContent) => {
  const response = await axios.put(`${host}/${qnaId}`, updatedContent, {
    headers: { 'Content-Type': 'text/plain' },
  });
  return response.data;
}

// 삭제
export const deleteReply = async (qnaId) => {
  const response = await axios.delete(`${host}/${qnaId}`);
  return response.data;
}
