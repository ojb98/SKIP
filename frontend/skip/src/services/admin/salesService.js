import axios from "axios";

export const fetchSalesSummary = async (startDate, endDate) => {
    const response = await axios.get(`/api/admin/sales-summary`, {
        params: {
            atStart: startDate,
            atEnd: endDate,
        },
    });
    return response.data;
};

export const fetchSalesChartData = async (startDate, endDate) => {
    const response = await axios.get(`/api/admin/sales-chart-data`, {
        params: {
            atStart: startDate,
            atEnd: endDate,
        },
    });
    return response.data;
};

export const fetchSalesList = async (startDate, endDate) => {
    const response = await axios.get(`/api/admin/sales-list`, {
        params: {
            atStart: startDate,
            atEnd: endDate,
        },
    });
    return response.data;
};
