import Product from "../model/productModel.js";
import { deleteImage } from "./cloudinaryHandler.js";

async function deleteProductsByCategory(id) {
    try {
        const products = await Product.find({ category: id })

        for (const product of products) {
            if (product?.image.public_id) {
                await deleteImage(product?.image?.public_id)
            }
        }
        await Product.deleteMany({ category: id })

    } catch (error) {
        throw new Error("Error while deleting products: " + error.message);

    }
}


export default deleteProductsByCategory