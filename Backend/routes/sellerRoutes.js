import express from "express"
import { addProduct, assignOrderToDeliveryPartner, changeOrderStatus, deleteProduct, editProduct, fetchAllDeliveryPartners, fetchSellerOrders, getAllSellerProducts, getSellerSingleProduct, settoggleProductStatus } from "../controllers/sellerControllers.js"
import { verifyUser } from "../middlewares/auth.js"

const route = express.Router()


route.post("/seller/add-product", verifyUser, addProduct)
route.get("/seller/products", verifyUser, getAllSellerProducts)
route.get("/seller/product/:id", verifyUser, getSellerSingleProduct)
route.post("/seller/edit/product/:id", verifyUser, editProduct)
route.post("/seller/delete/product/:id", verifyUser, deleteProduct)
route.post("/seller/active/product/:id", verifyUser, settoggleProductStatus)

route.get("/seller/all-orders", verifyUser, fetchSellerOrders)
route.post("/seller/order/status", verifyUser, changeOrderStatus)

route.get("/delivery/all", verifyUser, fetchAllDeliveryPartners)
route.post("/seller/assign/order", verifyUser, assignOrderToDeliveryPartner)
export default route