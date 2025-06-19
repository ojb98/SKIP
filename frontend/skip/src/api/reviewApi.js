import axios from "axios";
import caxios from "./caxios";

const host = 'http://localhost:8080/api/reviews';

// 리뷰 작성 정보
export const getReviewWriteInfoApi = async (rentItemId) => {
  const response = await caxios.get(`${host}/info/${rentItemId}`);
  return response.data;
}

// 리뷰 등록
export const createReviewApi = async (rentItemId, reviewData, imageFile) => {
  const formData = new FormData();

  // review JSON 데이터 추가
  const reviewBlob = new Blob([JSON.stringify(reviewData)],{ 
    type: 'application/json' 
  });
  formData.append('review', reviewBlob);

  // 이미지 파일 추가
  if(imageFile) {
    formData.append('image', imageFile);
  }

  // Axios 요청
  const response = await caxios.post(`${host}/${rentItemId}`,formData,{
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
}

// 리뷰 수정


// 리뷰 삭제(관리자)
// export const deleteReviewByAdmin = (reviewId) => {
//   return caxios.delete(`${host}/admin/delete/${reviewId}`)
// }

// // 리뷰 삭제(유저)
// export const deleteUserReviewApi = async (reviewId) => {
//   return await caxios.delete(`${host}/mypage/delete/${reviewId}`);
// }

// // 마이페이지 리뷰 목록 조회
// export const getUserReviewListApi = ({ startDate, page, size }) => {
//   const params = { page, size };
//   if(startDate) params.startDate = startDate;
//   return caxios.get(`${host}/user`,{ params });
// }


// // 관리자페이지 리뷰 목록 조회
// export const getReviewListForAdmin = async (username, itemName, hasReply, page = 0, size = 10) => {
//   const params = {
//     ...(username && { username }),
//     ...(itemName && { itemName }),
//     ...(hasReply !== null && hasReply !== undefined && { hasReply }),
//     page,
//     size,
//   };
//   const response = await caxios.get(`${host}/admin`,{ params });
//   return response.data;
// }


// // 아이템페이지 리뷰 목록 조회
// export const getReviewListByItem = async (itemId, sort = "recent", page = 0, size = 10) => {
//   const response = await axios.get(`http://localhost:8080/api/review/item/${itemId}`, {
//     params: {sort, page, size}
//   })
//   return response.data;
// }

// // 총 리뷰 수, 평균
// export const getReviewStatsByItem = async(itemId) => {
//   const response = await axios.get(`http://localhost:8080/api/review/stats/${itemId}`);
//   return response.data;
// }


