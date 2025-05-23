import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logout as logoutApi, getProfile } from "../api/userApi";


export const logout = createAsyncThunk('logout', () => {
    return logoutApi();
});

export const setProfile = createAsyncThunk('setProfile', async () => {
    const profile = await getProfile().then(res => res);
    return profile;
});

export const loginSlice = createSlice({
    name: 'loginSlice',
    initialState: { isLoading: true },
    reducers: { },
    extraReducers: builder => {
        builder
            .addCase(logout.fulfilled, (state, action) => {
                if (action.payload.success) {
                    state = { isLoggedIn: false, isLoading: false };
                }
            })
            .addCase(setProfile.fulfilled, (state, action) => {
                if (action.payload.success) {
                    const profile = action.payload.return;
                    state.userId = profile.userId;
                    state.username = profile.username;
                    state.email = profile.email;
                    state.social = profile.social;
                    state.roles = profile.roles;
                    state.registeredAt = profile.registeredAt;
                    state.image = profile.image;
                    state.nickname = profile.nickname;
                    state.isLoggedIn = true;
                } else {
                    state.isLoggedIn = false;
                }
                state.isLoading = false;
            })
            .addCase(setProfile.rejected, (state, action) => {
                console.log(action.error.message);
                state.isLoggedIn = false;
                state.isLoading = false;
            });
    }
});

export default loginSlice.reducer;