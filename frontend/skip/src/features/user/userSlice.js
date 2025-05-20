import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    totalUsers: 0,
    currentUsers: 0,
    newUserList: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action) => {
            return { ...state, ...action.payload };
        },
    },
});

export const { setUserData } = userSlice.actions;
export default userSlice.reducer;