import { createSlice } from "@reduxjs/toolkit";


const productsSlice = createSlice({
    name: "product",
    initialState: {
        product: {}
    },
    reducers: {
        setSingleProduct(state, action) {
            state.product = action.payload
        },
        clearSingleProduct(state) {
            state.product = {}
        }
    }
})


export const { setSingleProduct, clearSingleProduct } = productsSlice.actions
export default productsSlice.reducer