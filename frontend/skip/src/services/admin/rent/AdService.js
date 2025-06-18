import axios from 'axios';

export const fetchCash = async userId => {
  const resp = await axios.get('/api/rentAdmin/cash', { params: { userId } });
  return resp.data.remainingCash;
};

export const chargeCash = async data => {
  const resp = await axios.post('/api/rentAdmin/cash', data);
  return resp.data.remainingCash;
};

export const purchaseBoost = async (userId, boost, cpb) => {
  const resp = await axios.post('/api/rentAdmin/boost', { userId, boost, cpb });
  return resp.data.remainingCash;
};

export const submitBannerRequest = async formData => {
  const resp = await axios.post('/api/rentAdmin/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data;
};