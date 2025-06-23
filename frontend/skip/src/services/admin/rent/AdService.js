import axios from 'axios';


export const fetchCash = async (userId, rentId) => {
  const resp = await axios.get('/api/rentAdmin/cash', { params: { userId, rentId } });
  return resp.data.remainingCash;
};

export const chargeCash = async data => {
  const resp = await axios.post('/api/rentAdmin/cash', data);
  return resp.data.remainingCash;
};

export const fetchCpb = async (userId, rentId) => {
  const resp = await axios.get('/api/rentAdmin/boost/cpb', { params: { userId, rentId } });
  return resp.data.cpb;
};

export const decryptCash = async cashToken => {
  const resp = await axios.get('/api/rentAdmin/cash/decrypt', { params: { cashToken } });
  return resp.data.remainingCash;
};


export const fetchActiveBoost = async (userId, rentId) => {
  const resp = await axios.get('/api/rentAdmin/boost', { params: { userId, rentId } });
  return resp.data.activeBoost;
};

export const purchaseBoost = async (userId, rentId, boost, cpb, cashToken) => {
  const resp = await axios.post('/api/rentAdmin/boost', { userId, rentId, boost, cpb, cashToken });
  return resp.data.remainingCash;
};

export const submitBannerRequest = async (formData, cashToken) => {
  formData.append('cashToken', cashToken);
  const resp = await axios.post('/api/rentAdmin/banner', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return resp.data.remainingCash;
};