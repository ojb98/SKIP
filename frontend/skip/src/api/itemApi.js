import axios from "axios";

const host = 'http://localhost:8080/api/items';

// 아이템리스트 api
export const fetchPagedItems = async (rentId, category, page = 0, size = 10) => {
  const res = await axios.get(`${host}/paging/${rentId}?category=${category}&page=${page}&size=${size}`);
  return res.data;
}

// 아이템 상세 리스트 조회 api
export const fetchItemDetail = async (rentId, itemId) => {
  const res = await axios.get(`${host}/${rentId}/${itemId}`);
  return res.data;
}

// 아이템 상세 페이지 api
export const fetchItemDetailPage = async (rentId, itemId) => {
  const res = await axios.get(`${host}/detail/${rentId}/${itemId}`);
  return res.data;
}