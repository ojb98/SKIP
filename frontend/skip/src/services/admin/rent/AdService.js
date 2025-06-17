import axios from 'axios';

export const fetchMileage = async userId => {
  const resp = await axios.get('/api/rentAdmin/mileage', { params: { userId } });
  return resp.data.remainingMileage;
};

export const purchaseMileage = async (userId, amount) => {
  const resp = await axios.post('/api/rentAdmin/mileage', { userId, amount });
  return resp.data.remainingMileage;
};

export const submitBannerRequest = async formData => {
  const resp = await axios.post('/api/rentAdmin/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data;
};