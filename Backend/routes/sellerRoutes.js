import express from "express"
import { loginSeller, registerSeller } from "../controllers/sellerControllers.js"

const route = express.Router()

route.post("/seller/register", registerSeller)
route.post("/seller/login", loginSeller)

export default route