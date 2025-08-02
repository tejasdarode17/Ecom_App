import express from "express";
import { userlogout } from "../controllers/userControllers.js";
import { checkAuth, verifyUser } from "../middlewares/verifyUser.js";


const route = express.Router()


route.post("/user/logout", userlogout)
route.get("/user/check-auth", verifyUser, checkAuth) //auto login and sending the userdata insted of storing it in local storage 

export default route





//kal seller apne add item wale task pure karega
//aur user ke homepage pr show hoga sabkuch