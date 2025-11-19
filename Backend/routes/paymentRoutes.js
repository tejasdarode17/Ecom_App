import express from "express";
import { createOrder, verifyPayment } from "../controllers/PaymentController.js";
import { verifyUser } from "../middlewares/auth.js";

const route = express.Router();


route.post("/create-order", verifyUser, createOrder)
route.post("/verify-payment", verifyUser, verifyPayment)

export default route;
