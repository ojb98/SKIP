import axios from "axios";

const host = 'http://localhost:8080/api/wishes';

export const addWishApi = async (userId, itemDetailId) => {
  const res = await axios.post(`${host}`, {
    userId,
    itemDetailId,
  });
  return res.data;
};