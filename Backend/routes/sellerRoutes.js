import express from "express"
import { registerSeller } from "../controllers/sellerControllers.js"


const route = express.Router()

route.post("/register", registerSeller)


export default route