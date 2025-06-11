import axios from "axios";

const host = 'http://localhost:8080/api/qna/reply';

// 답변 저장
export const createReply = async (replyData) => {
  const response = await axios.post(`${host}`, replyData);
  return response.data;
}

// 조회 (수정/삭제용)
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
export const updateReply = async (qnaId, replyData) => {
  const response = await axios.put(`${host}/${qnaId}`, replyData);
  return response.data;
}

// 삭제
export const deleteReply = async (qnaId, userId) => {
  const response = await axios.delete(`${host}/${qnaId}`, {
    data: {
      qnaId,
      userId,
    }
  });
  return response.data;
}
