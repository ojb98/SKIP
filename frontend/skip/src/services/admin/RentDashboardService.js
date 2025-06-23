import axios from "axios";
import caxios from "../../api/caxios";

export const fetchRentSummary = async (userId, rentId, startDate, endDate) => {
  const params = { userId, startDate, endDate };
  if (rentId) params.rentId = rentId;
  const response = await caxios.get(`/api/rentAdmin/summary`, { params });
  return response.data;
};

export const fetchRentChart = async (userId, rentId, start, end) => {
  const params = { userId, start, end };
  if (rentId) params.rentId = rentId;
  const response = await caxios.get(`/api/rentAdmin/sales/chart`, { params });
  return response.data;
};

