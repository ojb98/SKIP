import axios from "axios";
import caxios from "../../api/caxios";

export const fetchRentSummary = async (userId, startDate, endDate) => {
  const response = await caxios.get(`/api/rentAdmin/summary`, {
    params: { userId, startDate, endDate },
  });
  return response.data;
};

export const fetchRentChart = async (userId, start, end) => {
  const response = await caxios.get(`/api/rentAdmin/sales/chart`, {
    params: { userId, start, end },
  });
  return response.data;
};

