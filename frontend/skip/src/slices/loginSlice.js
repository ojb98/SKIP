import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProfile } from "../api/userApi";

export const setProfile = createAsyncThunk('setProfile', () => {
    return getProfile();
});

export const loginSlice = createSlice({
    name: 'login',
    initialState: {
        loggedIn: sessionStorage.getItem('loggedIn') ? true : false
    },
    reducers: {
        login: (state, action) => {
            // 서버와 통신하도록 재구현
            sessionStorage.setItem('loggedIn', 'true');
            state.loggedIn = true;
            console.log(state.loggedIn);
        },
        logout: state => {
            // 서버와 통신하도록 재구현
            sessionStorage.clear();
            state.loggedIn = false;
            console.log(state.loggedIn);
        }
    },
    extraReducers: builder => {
        builder
            .addCase(setProfile.fulfilled, (state, action) => {
                const profile = action.payload;
                state.userId = profile.userId;
                state.username = profile.username;
                state.email = profile.email;
                state.social = profile.social;
                state.roles = profile.roles;
                state.registeredAt = profile.registeredAt;
                state.image = profile.image;
            });
    }
});

export default loginSlice.reducer;

export const { login, logout } = loginSlice.actions;