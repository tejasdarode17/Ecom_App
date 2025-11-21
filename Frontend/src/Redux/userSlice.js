import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios"

export const fetchOrders = createAsyncThunk("fetch-orders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
            withCredentials: true
        })
        return response.data.orders
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

const userSlice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        orders: [],
        order: {},
        wishlist: []
    },
    reducers: {
        setOrder(state, action) {
            state.order = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchOrders.fulfilled, (state, action) => {
                state.loading = false
                state.orders = action.payload
            })
            .addCase(fetchOrders.rejected, (state) => {
                state.loading = false
            })
    }
})


export const { setOrder } = userSlice.actions

export default userSlice.reducer

