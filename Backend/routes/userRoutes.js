import express from "express";
import { loginUser, registerUser, userlogout } from "../controllers/userControllers.js";
import { checkAuth, verifyUser } from "../middlewares/verifyUser.js";


const route = express.Router()

route.post("/user/register", registerUser)
route.post("/user/login", loginUser)
route.post("/user/logout", userlogout)

export default route
