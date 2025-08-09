import express from "express";


import { loginSeller, loginUser, logout, registerSeller, registerUser } from "../../controllers/Auth Controllers/authControllers.js";
import { checkAuth, verifyUser } from "../../middlewares/auth.js";

const route = express.Router()



//this is user routes for login 
route.post("/user/register", registerUser)
route.post("/user/login", loginUser)


//Seller routes for login and registration 
route.post("/seller/register", registerSeller)
route.post("/seller/login", loginSeller)


//common routes 
route.post("/user/logout", logout)
route.get("/user/check-auth", verifyUser, checkAuth) //auto login and sending the userdata insted of storing it in local storage 

export default route


