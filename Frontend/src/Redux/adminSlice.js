import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";

export const fetchAllSellers = createAsyncThunk("fetch/seller", async ({ status, page = 1, limit = 20 }, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/admin/sellers`,
            {
                params: { status, page, limit },
                withCredentials: true
            }
        );
        return {
            status,
            sellers: response.data.sellers,
            total: response.data.total,
            page: response.data.page,
        };
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const fetchAllOrders = createAsyncThunk("fetch/orders",)


const adminSlice = createSlice({
    name: "admin",
    initialState: {
        loading: false,
        seller: {},
        sellersByStatus: {
            all: { data: [], total: 0, page: 1 },
            pending: { data: [], total: 0, page: 1 },
            suspend: { data: [], total: 0, page: 1 },
            banned: { data: [], total: 0, page: 1 }
        },
    },
    reducers: {
        setSeller(state, action) {
            state.seller = action.payload
        },

        updateSellerStatus(state, action) {
            const { id, status } = action.payload

            for (let statusKey in state.sellersByStatus) {
                const index = state.sellersByStatus[statusKey].data.findIndex((s) => s._id === id)
                if (index !== -1) {
                    state.sellersByStatus[statusKey].data[index].status = status
                }
            }

            if (state.seller && state.seller._id === id) {
                state.seller.status = status
            }
        }

    }, extraReducers: (builder) => {
        builder
            .addCase(fetchAllSellers.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchAllSellers.fulfilled, (state, action) => {
                const { status, sellers, total, page } = action.payload

                if (state.sellersByStatus[status]) {
                    state.sellersByStatus[status].data = sellers;
                    state.sellersByStatus[status].total = total;
                    state.sellersByStatus[status].page = page;
                }

                state.loading = false
            })
            .addCase(fetchAllSellers.rejected, (state) => {
                state.loading = false
            })
    }
})


export const { setSeller, updateSellerStatus } = adminSlice.actions
export default adminSlice.reducer



