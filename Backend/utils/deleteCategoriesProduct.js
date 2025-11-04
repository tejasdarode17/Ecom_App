import Product from "../model/productModel.js";
import { deleteImages } from "./cloudinaryHandler.js";

async function deleteProductsByCategory(categoryId) {
    try {
        const products = await Product.find({ category: categoryId });
        if (!products.length) return;

        const allPublicIDs = products.flatMap(p => p.images.map(img => img.public_id));

        if (allPublicIDs.length > 0) {
            await deleteImages(allPublicIDs);
        }

        await Product.deleteMany({ category: categoryId });
    } catch (error) {
        throw new Error("Error while deleting products: " + error.message);
    }
}

export default deleteProductsByCategory;
