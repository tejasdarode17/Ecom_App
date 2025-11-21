import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchOngoingDeliveryOrders = createAsyncThunk("fetch-ongoing-orders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/pending-orders`,
            { withCredentials: true }
        );
        // console.log(response?.data);
        return response.data.orders
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const fetchAllDeliveryOrders = createAsyncThunk("fetch-all-orders", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/delivery/all-orders`,
            { withCredentials: true }
        );
        console.log(response?.data);
        return response.data.orders
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})


const deliverySlice = createSlice({
    name: "delivery",
    initialState: {
        ongoingLoading: false,
        ongingOrders: [],
        AllLoading: false,
        allDeliveryOrders: []
    },
    reducers: {
        updateStatusOfOrder(state, action) {
            const updatedItem = action.payload
            const orderIndex = state.ongingOrders.findIndex(o => o.item._id === updatedItem._id);
            if (orderIndex !== -1) {
                state.ongingOrders[orderIndex].item.deliveryStatus = updatedItem.deliveryStatus;
                state.ongingOrders[orderIndex].item.status = updatedItem.status;
            }
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchOngoingDeliveryOrders.pending, (state, action) => {
                state.ongoingLoading = true
            })
            .addCase(fetchOngoingDeliveryOrders.fulfilled, (state, action) => {
                state.ongingOrders = action.payload
                state.ongoingLoading = false
            })
            .addCase(fetchOngoingDeliveryOrders.rejected, (state, action) => {
                state.ongoingLoading = false
            })
        builder
            .addCase(fetchAllDeliveryOrders.pending, (state, action) => {
                state.AllLoading = true
            })
            .addCase(fetchAllDeliveryOrders.fulfilled, (state, action) => {
                state.allDeliveryOrders = action.payload
                state.AllLoading = false
            })
            .addCase(fetchAllDeliveryOrders.rejected, (state, action) => {
                state.AllLoading = false
            })
    }
})


export const { updateStatusOfOrder } = deliverySlice.actions
export default deliverySlice.reducer


