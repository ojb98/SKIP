import axios from 'axios';
import caxios from '../../api/caxios';

//등록 대기중인 배너 불러오기
export const fetchWaitingBanners = async () => {
  const response = await caxios.get('/api/banners/waiting');
  return response.data;
};

//승인된 배너 불러오기
export const fetchApprovedWaitingBanners = async () => {
  const response = await caxios.get('/api/banners/waiting/approved');
  return response.data;
};

//등록된 배너 불러오기
export const fetchActiveBanners = async () => {
  const response = await caxios.get('/api/banners/active');
   return response.data.map(banner => ({
    ...banner,
    finalScore: Number(banner.finalScore)
  }));
};

//배너 요청 -승인
export const approveBanner = async (waitingId) => {
  return await caxios.put(`/api/banners/waiting/${waitingId}/approve`);
};

//배너 요청 -반려
export const rejectBanner = async (waitingId, reason) => {
  return await caxios.put(`/api/banners/waiting/${waitingId}/reject`, { reason });
};