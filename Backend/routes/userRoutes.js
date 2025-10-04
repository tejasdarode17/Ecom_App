import express from "express";
import { fetchSearchProducts, fetchSearchSuggestions } from "../controllers/userControllers.js";

const route = express.Router()

route.get("/search", fetchSearchProducts)
route.get("/search/suggestions", fetchSearchSuggestions)


export default route
