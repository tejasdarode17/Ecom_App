import express from "express"
import { verifyUser } from "../middlewares/auth.js"
import { fetchPartnerAllOrders, fetchPartnerPendingOrders, updateDeliveryStatus } from "../controllers/deliveryPartnerController.js"

const route = express.Router()

route.get("/delivery/all-orders", verifyUser, fetchPartnerAllOrders)
route.get("/delivery/pending-orders", verifyUser, fetchPartnerPendingOrders)
route.post("/delivery/status", verifyUser, updateDeliveryStatus)
export default route