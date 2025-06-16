import axios from "axios";

// 요약 통계
export const fetchSalesSummary = async (startDate, endDate) => {
    const response = await axios.get(`/api/admin/summary`, {
        params: {
            startDate,
            endDate,
        },
    });
    return response.data;
};

// 특정 날짜의 매출 요약 데이터
export const fetchDaySalesSummary = async (date) => {
    const response = await axios.get(`/api/admin/sales/today`, {
        params: {
            todaysDate: date,
        },
    });
    return response.data;
};

export const fetchSalesChartData = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    console.warn("차트 데이터 요청 실패: 날짜가 지정되지 않았습니다.");
    return [];
  }

  const response = await axios.get(`/api/admin/sales/chart`, {
    params: {
      start: startDate,
      end: endDate,
    },
  });
  return response.data;
};


export const fetchSalesList = async (startDate, endDate) => {
    const response = await axios.get(`/api/admin/sales/list`, {
        params: {
            atStart: startDate,
            atEnd: endDate,
        },
    });
    return response.data;
};

