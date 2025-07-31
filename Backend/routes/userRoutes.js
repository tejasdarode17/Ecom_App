import { loginUser, registerUser } from "../controllers/userControllers.js";
import express from "express";


const route = express.Router()

route.post("/user/register", registerUser)
route.post("/user/login", loginUser)



export default route
