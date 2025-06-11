import axios from "axios";

const host = 'http://localhost:8080/api/reviews';

// 리뷰 등록
export const createReviewApi = async (reserveId, reviewData, imageFile, userId) => {
  const formData = new FormData();

  // review JSON 데이터 추가
  const reviewBlob = new Blob(
    [JSON.stringify(reviewData)],
    { type: 'application/json' }
  );
  formData.append('review', reviewBlob);

  // 이미지 파일 추가
  if(imageFile) {
    formData.append('image', imageFile);
  }

  // Axios 요청
  const response = await axios.post(`${host}/${reserveId}?userId=${userId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });
  return response.data;
}

// 리뷰 수정


// 리뷰 삭제


// 마이페이지 리뷰 목록 조회


// 관리자페이지 리뷰 목록 조회


// 아이템페이지 리뷰 목록 조회


// 리뷰 평점 평균
// export const getAverageRatingApi = async (rentId, itemId) => {
//   const response = await axios.get(`${host}/rent/item/average`, {
//     params: { rentId, itemId },
//   });
//   return response.data;
// };


