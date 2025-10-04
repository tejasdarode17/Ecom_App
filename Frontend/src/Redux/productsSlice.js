import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchSearchProducts = createAsyncThunk("fetch/products", async (query, { rejectWithValue }) => {

    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/search/suggestions`,
            {
                params: {
                    search: query
                },
                withCredentials: true
            }
        );
        console.log(response.data);
        return response?.data?.products
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || "Something went wrong on server"
        );
    }
})


const productsSlice = createSlice({
    name: "product",
    initialState: {
        loading: false,
        products: [],
        product: {},
        error: null
    },
    reducers: {
        setSingleProduct(state, action) {
            state.product = action.payload
        },
        clearSingleProduct(state) {
            state.product = {}
        },
    }, extraReducers: (builder) => {
        builder.addCase(fetchSearchProducts.pending, (state, action) => {
            state.loading = true
        })
        builder.addCase(fetchSearchProducts.fulfilled, (state, action) => {
            state.products = action.payload
        })
        builder.addCase(fetchSearchProducts.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload || "Failed to fetch products"
        })
    }
})


export const { setSingleProduct, clearSingleProduct } = productsSlice.actions
export default productsSlice.reducer