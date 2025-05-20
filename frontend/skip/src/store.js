import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "./features/dashboard/dashboardSlice";
import userReducer from "./features/user/userSlice";

export const store = configureStore({
    reducer: {
        dashboard: dashboardReducer,
        user: userReducer,
    },
});

export default store;