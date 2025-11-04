import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "axios";


export const fetchCartThunk = createAsyncThunk("fetch-cart", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/cart`, {
            withCredentials: true,
        });
        console.log(response.data);
        return response.data.cart
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})

export const addToCartThunk = createAsyncThunk("add-cart", async ({ productID, quantity, attributes }, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/add-cart`,
            { productID, quantity, attributes },
            { withCredentials: true, }
        )
        console.log(response.data);
        return response.data.cart
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})



export const checkOut = createAsyncThunk("checkout", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/checkout`, {
            withCredentials: true,
        });
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})






const cartSllice = createSlice({
    name: "cart",
    initialState: {
        loading: false,
        cart: {},
        chekOut: {}
    },
    reducers: {
        setBuyNowItem(state, action) {
            state.buyNowItem = action.payload
        },
        clearBuyNowItem(state) {
            state.buyNowItem = {}
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchCartThunk.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(fetchCartThunk.rejected, (state) => {
                state.loading = false;
            })
        builder
            .addCase(addToCartThunk.pending, (state) => {
                state.loading = true
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.loading = false
                state.cart = action.payload
            })
            .addCase(addToCartThunk.rejected, (state) => {
                state.loading = false;
            })

        builder
            .addCase(checkOut.pending, (state) => {
                state.loading = true
            })
            .addCase(checkOut.fulfilled, (state, action) => {
                state.loading = false
                state.chekOut = action.payload.cart
            })
            .addCase(checkOut.rejected, (state) => {
                state.loading = false;
            })
    }

})


export const { setBuyNowItem, clearBuyNowItem } = cartSllice.actions
export default cartSllice.reducer



