import express from "express";
import { addAddress, addCart, checkOut, editAddress, fetchCart, fetchSearchProducts, fetchSearchSuggestions } from "../controllers/userControllers.js";
import { verifyUser } from "../middlewares/auth.js"

const route = express.Router()

route.get("/search/suggestions", fetchSearchSuggestions)
route.get("/search", fetchSearchProducts)

route.post("/address", verifyUser, addAddress)
route.post("/address/:id", verifyUser, editAddress)

route.post("/add-cart", verifyUser, addCart)
route.get("/cart", verifyUser, fetchCart)
route.get("/checkout", verifyUser, checkOut)

export default route
