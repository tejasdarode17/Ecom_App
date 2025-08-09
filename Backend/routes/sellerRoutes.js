import express from "express"
import { addProduct, getAllSellerProducts } from "../controllers/sellerControllers.js"
import { verifyUser } from "../middlewares/auth.js"

const route = express.Router()


route.post("/seller/add-product", verifyUser, addProduct)
route.get("/seller/products", verifyUser, getAllSellerProducts)


export default route