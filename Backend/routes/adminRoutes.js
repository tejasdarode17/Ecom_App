import express from "express"
import { verifyUser } from "../middlewares/auth.js"
import { changeSellerStatus, createBanner, createCarousel, createCatogery, deleteCatogery, editCarousel, editCategory, fetchCarousel, getAllCategories, getAllSellers, getSelectedSeller } from "../controllers/adminControllers.js"

const route = express.Router()

route.post("/admin/add-category", verifyUser, createCatogery)
route.get("/admin/category", getAllCategories)
route.post("/admin/edit-category/:id", verifyUser, editCategory)
route.delete("/admin/delete-category/:id", verifyUser, deleteCatogery)

route.get("/admin/sellers", verifyUser, getAllSellers)
route.get("/admin/seller/:id", verifyUser, getSelectedSeller)
route.post("/admin/status-seller/:id", verifyUser, changeSellerStatus)


route.post("/admin/add-carousel", verifyUser, createCarousel)
route.post("/admin/edit-carousel/:id", verifyUser, editCarousel)
route.get("/carousels", fetchCarousel)


route.post("/admin/add-banner", verifyUser, createBanner)



export default route