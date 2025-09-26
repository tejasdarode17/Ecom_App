import express from "express";
import { verifyUser } from "../middlewares/auth.js";
import upload from "../config/multer.js";
import { deleteImageController, uploadImageController, uploadImagesController } from "../controllers/imageControllers.js";


const router = express.Router();

router.post("/upload-image", verifyUser, upload.single("image"), uploadImageController);
router.post("/delete-image", verifyUser, deleteImageController);

router.post("/upload-images", verifyUser, upload.array("images", 10), uploadImagesController);

export default router;