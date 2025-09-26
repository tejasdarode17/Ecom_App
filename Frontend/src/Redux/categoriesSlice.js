import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchAllCategories = createAsyncThunk("categories/fetch", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/category`, {
            withCredentials: true,
        });
        console.log(response.data);
        return response.data.categories

    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})


const categoriesSlice = createSlice({
    name: "categories",
    initialState: {
        loading: false,
        categories: []
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategories.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAllCategories.fulfilled, (state, action) => {
                state.loading = false
                state.categories = action.payload
            })
            .addCase(fetchAllCategories.rejected, (state) => {
                state.loading = true
            })
    }
})


export const { } = categoriesSlice.actions
export default categoriesSlice.reducer

