import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAllSellerProducts = createAsyncThunk(
    "seller/products",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/products`,
                { withCredentials: true }
            );
            console.log(response.data);
            return response.data.products;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || "Something went wrong on server"
            );
        }
    }
);

const sellerSlice = createSlice({
    name: "seller",
    initialState: {
        loading: false,
        products: [],
        orders: [],
    },
    reducers: {
        clearAllProducts(state) {
            state.products = []
        },

        addProduct(state, action) {
            state.products.push(action.payload);
        },

        deleteProduct(state, action) {
            const productID = action.payload
            state.products = state.products.filter((p) => p._id !== productID);
        },

        updateProduct(state, action) {
            const { id, product } = action.payload;
            const index = state.products.findIndex((p) => p._id === id);
            if (index !== -1) {
                state.products[index] = product;
            }
        },

        updateProductStatus(state, action) {
            const { id, active } = action.payload;
            const product = state.products.find((p) => p._id === id);
            if (product) {
                product.active = active;
            }
        },

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSellerProducts.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSellerProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload;
            })
            .addCase(fetchAllSellerProducts.rejected, (state) => {
                state.loading = false;
            });
    },
});

export const { clearAllProducts, updateProductStatus, addProduct, deleteProduct, updateProduct } = sellerSlice.actions
export default sellerSlice.reducer;
