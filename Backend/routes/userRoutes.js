import express from "express";
import { addAddress, addCart, buyNow, checkOut, deleteCart, editAddress, fetchCart, fetchSearchProducts, fetchSearchSuggestions, getAllOrders } from "../controllers/userControllers.js";
import { verifyUser } from "../middlewares/auth.js"

const route = express.Router()

route.get("/search/suggestions", fetchSearchSuggestions)
route.get("/search", fetchSearchProducts)

route.post("/address", verifyUser, addAddress)
route.post("/address/:id", verifyUser, editAddress)

route.post("/add-cart", verifyUser, addCart)
route.delete("/delete-cart", verifyUser, deleteCart)
route.post("/buy-now", verifyUser, buyNow)
route.get("/cart", verifyUser, fetchCart)
route.get("/checkout", verifyUser, checkOut)

route.get("/orders", verifyUser, getAllOrders)


export default route
