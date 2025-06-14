import axios from "axios";

const host='http://localhost:8080/api/reservations';


// 1. 예약 목록 조회
export const reservListApi = async (userId, filters = {}) => {
  const params = {
    ...filters,
    sort: filters.sort || "DESC",
  };

  // keyword 분리 처리
  if (filters.keyword) {
    params.username = filters.keyword;
    params.name = filters.keyword;
    delete params.keyword;
  }

  const { data } = await axios.get(`${host}/manager/${userId}`, {
    params,
  });

  return data;
};

// 2. 예약 상세 조회
export const reservDetailApi = async (rentItemId) => {
  const { data } = await axios.get(`${host}/detail/${rentItemId}`);
  return data;
};


export const reservItemReturnApi = async(rentItemId)=>{
    const data = await axios.patch(`${host}/${rentItemId}/return`).then((res)=>{
        console.log("예약 반납 ==>",res);
        return res.data;
    });
    return data;
}

