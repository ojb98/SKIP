import { configureStore } from "@reduxjs/toolkit";
import loginSlice from "./slices/loginSlice";
import forecastsSlice from "./slices/forecastsSlice";

export default configureStore({
    reducer: {
        loginSlice: loginSlice,
        forecastsSlice: forecastsSlice
    }
});