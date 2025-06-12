import axios from 'axios';

export const fetchWaitingBanners = async () => {
  const response = await axios.get('/api/banners/waiting');
  return response.data;
};

export const approveBanner = async (waitingId) => {
  return await axios.put(`/api/banners/waiting/${waitingId}/approve`);
};

export const rejectBanner = async (waitingId, reason) => {
  return await axios.put(`/api/banners/waiting/${waitingId}/reject`, { reason });
};