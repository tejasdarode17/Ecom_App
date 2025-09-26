import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import productsSlice from "./productsSlice"
import sellerSlice from "./sellerSlice"
import categoriesSlice from "./categoriesSlice"
import adminSlice from "./adminSlice"
import bannersSlice from "./bannersSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        seller: sellerSlice,
        admin: adminSlice,
        product: productsSlice,
        categories: categoriesSlice,
        banners: bannersSlice
    }
})

export default store