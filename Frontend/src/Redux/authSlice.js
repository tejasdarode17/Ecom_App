import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/check-auth`, {
            withCredentials: true,
        });
        return response?.data?.user
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

const authSlice = createSlice({
    name: "auth",
    initialState: {
        isAuthenticated: false,
        loading: false,
        userData: {}
    },
    reducers: {
        setUser(state, action) {
            state.isAuthenticated = true
            state.userData = action.payload
        },
        clearUser(state) {
            state.userData = {}
            state.isAuthenticated = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkAuth.pending, (state) => {
                state.loading = true
                state.isAuthenticated = false
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false
                state.isAuthenticated = true
                state.userData = action.payload
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false
                state.isAuthenticated = false
            })
    }
})

export const { clearUser, setUser } = authSlice.actions;
export default authSlice.reducer;