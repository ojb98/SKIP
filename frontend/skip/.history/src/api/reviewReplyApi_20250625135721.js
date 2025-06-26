import axios from "axios";
import caxios from "./caxios";

const host = '`${__APP_BASE__}/api/reviews/admin'

// 답변 등록
export const createReviewReply = async (reviewReplyRequestDTO) => {
  const response = await caxios.post(`${host}`, reviewReplyRequestDTO );
  return response.data;
}

// 답변 수정
export const updateReviewReply = async (reviewId, reviewReplyRequestDTO) => {
  const response = await caxios.put(`${host}/${reviewId}`, reviewReplyRequestDTO);
  return response.data;
}

// 답변 삭제
export const deleteReviewReply = async (reviewId) => {
  await caxios.delete(`${host}/${reviewId}`);
}

// 답변 단건 조회 (수정, 삭제용)
export const getReviewReplyByReviewId = async (reviewId) => {
  const response = await caxios.get(`${host}/${reviewId}`);
  return response.data;
}

// 답변 단건 조회 (화면)
export const getReplySummary = async (reviewId) => {
  const response = await caxios.get(`${host}/${reviewId}/summary`);
  return response.data;
}