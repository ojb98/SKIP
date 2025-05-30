import axios from "axios";

const host = 'http://localhost:8080/api/reviews';

// 리뷰 등록
export const writeReviewApi = async (FormData, userId) => {
  const response = await axios.post(`${host}?userId=${userId}`,FormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log("리뷰 등록 ==>", response);
  return response.data;
};

// 리뷰 수정
export const updateReviewApi = async (reviewId, FormData, userId) => {
  const response = await axios.put(`${host}/${reviewId}?userId=${userId}`, FormData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log("리뷰 수정 ==>", response);
  return response.data;
};

// 리뷰 삭제
export const deleteReviewApi = async (reviewId, userId) => {
  const response = await axios.delete(`${host}/${reviewId}?userId=${userId}`);
  console.log("리뷰 삭제 ==>", response);
  return response.data;
};

// 유저(본인) 리뷰 목록 조회
export const getUserReviewsApi = async (userId, page = 0, size = 10) => {
  const response = await axios.get(`${host}/user?userId=${userId}&page=${page}$size=${size}`);
  console.log("내 리뷰 목록 ==>", response);
  return response.data;
};

// 렌탈샵 리뷰 목록 조회
export const getRentalReviewsApi = async (rentId, page = 0, size = 10) => {
  const response = await axios.get(`${host}/rental?rentId=${rentId}&page=${page}&size=${size}`);
  console.log("렌탈샵 리뷰 목록 ==>", response);
  return response.data;
};

// 렌탈샵 아이템별 리뷰 목록 조회
export const getItemReviewsApi = async (rentId, itemId, page = 0, size = 10, sort) => {
  const response = await axios.get(`${host}/rent/item`,{
    params: { rentId, itemId, page, size, sort },
  });
  return response.data;
};

// 리뷰 평점 평균
// export const getAverageRatingApi = async (rentId, itemId) => {
//   const response = await axios.get(`${host}/rent/item/average`, {
//     params: { rentId, itemId },
//   });
//   return response.data;
// };


