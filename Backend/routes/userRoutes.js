import { registerUser } from "../controllers/userControllers";
import express from "express";


const route = express.Router()

route.post("/user/register", registerUser)




export default route
