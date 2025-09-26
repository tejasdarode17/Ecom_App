import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchAllCarousels = createAsyncThunk("fetch/carousels", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/carousels`, {
            withCredentials: true,
        });
        console.log(response.data);
        return response.data.carousels
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

const bannersSlice = createSlice({
    name: "banners",
    initialState: {
        loading: "false",
        carousels: [],
        banners: [],
    },
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCarousels.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAllCarousels.fulfilled, (state, action) => {
                state.loading = false
                state.carousels = action.payload
            })
            .addCase(fetchAllCarousels.rejected, (state) => {
                state.loading = false
            })
    }
})

export const { } = bannersSlice.actions
export default bannersSlice.reducer