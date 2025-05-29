import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    daily: { YESTERDAY: 0, TODAY: 0 },
    weekly: { LASTWEEK: 0, THISWEEK: 0 },
    monthly: { LASTMONTH: 0, THISMONTH: 0 },
    yearly: { LASTYEAR: 0, THISYEAR: 0 },
};

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        setDashboardData: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setDashboardData } = dashboardSlice.actions;
export default dashboardSlice.reducer;