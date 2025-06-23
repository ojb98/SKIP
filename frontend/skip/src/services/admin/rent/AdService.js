import caxios from '../../../api/caxios';


export const fetchCash = async (userId, rentId) => {
  const resp = await caxios.get('/api/rentAdmin/cash', { params: { userId, rentId } });
  return resp.data.remainingCash;
};

export const chargeCash = async data => {
  const resp = await caxios.post('/api/rentAdmin/cash', data);
  return resp.data.remainingCash;
};

export const fetchCpb = async (userId, rentId) => {
  const resp = await caxios.get('/api/rentAdmin/boost/cpb', { params: { userId, rentId } });
  return resp.data.cpb;
};

export const decryptCash = async cashToken => {
  const resp = await caxios.get('/api/rentAdmin/cash/decrypt', { params: { cashToken } });
  return resp.data.remainingCash;
};


export const fetchActiveBoost = async (userId, rentId) => {
  const resp = await caxios.get('/api/rentAdmin/boost', { params: { userId, rentId } });
  return resp.data.activeBoost;
};

export const purchaseBoost = async (userId, rentId, boost, cpb, cashToken) => {
  const resp = await caxios.post('/api/rentAdmin/boost', { userId, rentId, boost, cpb, cashToken });
  return resp.data.remainingCash;
};
export const fetchRentRatings = async (userId, rentId) => {
  const resp = await caxios.get('/api/rentAdmin/banner/ratings', { params: { userId, rentId } });
  return resp.data;
};


export const submitBannerRequest = async (formData, cashToken) => {
  formData.append('cashToken', cashToken);
  const resp = await caxios.post('/api/rentAdmin/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data.remainingCash;
};

export const fetchBannerDetail = async (userId, waitingId) => {
  const resp = await caxios.get(`/api/rentAdmin/banner/${waitingId}`, {
    params: { userId },
  });
  return resp.data;
};

export const fetchWithdrawnBanner = async userId => {
  const resp = await caxios.get('/api/rentAdmin/banner/withdrawn', {
    params: { userId },
  });
  return resp.data;
};

export const resubmitBannerRequest = async (
  waitingId,
  userId,
  cpcBid,
  bannerImage,
) => {
  const form = new FormData();
  form.append('userId', userId);
  form.append('cpcBid', cpcBid);
  if (bannerImage) form.append('bannerImage', bannerImage);
  const resp = await caxios.put(`/api/rentAdmin/banner/${waitingId}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data;
}