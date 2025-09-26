import Seller from "../model/sellerModel.js";
import Product from "../model/productModel.js";
import { deleteImage } from "../utils/cloudinaryHandler.js";




export async function addProduct(req, res) {

    const { name, category, image, brand, description, stock, price, salePrice } = req.body

    const sellerID = req.user.id

    try {

        if (!name || !category || !brand || !description || !stock || !price) {
            return res.status(400).json({
                success: false,
                message: "Something is missing"
            })
        }

        if (!image || !image.url || !image.public_id) {
            return res.status(400).json({ message: "Image data is missing" });
        }

        const seller = await Seller.findOne({ _id: sellerID })

        if (!seller || seller.role !== "seller") {
            return res.status(400).json({
                success: false,
                message: "You are not authorized or you are not seller "
            })
        }

        const newProduct = new Product({
            name,
            category,
            image,
            brand,
            description,
            stock,
            price,
            salePrice,
            seller: sellerID
        })

        await newProduct.save()

        await Seller.findByIdAndUpdate(sellerID, { $push: { products: newProduct._id } });


        await newProduct.populate([
            { path: 'seller', select: 'username email role' },
            { path: 'category', select: 'name _id' }
        ])

        return res.status(200).json({
            success: true,
            message: "product added succesfully",
            product: newProduct
        })

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

export async function getAllSellerProducts(req, res) {

    try {
        const sellerId = req.user.id

        const seller = await Seller.findOne({ _id: sellerId })

        if (!seller || seller.role !== "seller") {
            return res.status(400).json({
                success: false,
                message: "You are not authorized or you are not seller "
            })
        }

        const products = await Product.find({ seller: sellerId })
            .populate("seller", "username email role")
            .populate("category", "name _id");

        return res.status(200).json({
            success: true,
            message: "product fetched succesfully",
            products: products
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

export async function getSellerSingleProduct(req, res) {

    try {
        const sellerID = req.user.id
        const { id } = req.params

        const seller = await Seller.findOne({ _id: sellerID })

        if (!seller || seller.role !== "seller") {
            return res.status(400).json({
                success: false,
                message: "You are not authorized or you are not seller "
            })
        }
        const product = await Product.findById(id)
            .populate("category", "name _id")
            .populate("seller", "username email role")


        if (!product) {
            return res.status(400).json({
                success: false,
                message: "Product Not found"
            })
        }

        return res.status(200).json({
            success: true,
            message: "product fetched succesfully",
            product: product
        })


    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

export async function editProduct(req, res) {

    try {

        const { id } = req.params;
        const sellerID = req.user.id;
        const { name, category, image, brand, description, stock, price } = req.body;


        const seller = await Seller.findById(sellerID);
        if (!seller || seller.role !== "seller") {
            return res.status(400).json({
                success: false,
                message: "You are not authorized or you are not seller"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        // Update only changed fields
        if (name) product.name = name;
        if (category) product.category = category;
        if (brand) product.brand = brand;
        if (description) product.description = description;
        if (stock !== undefined) product.stock = stock;
        if (price !== undefined) product.price = price;

        if (image && image.url && image.public_id) {
            if (product.image?.public_id !== image.public_id) {
                await deleteImage(product.image?.public_id);
                product.image = image;
            }
        }

        await product.save();
        await product.populate([
            { path: 'seller', select: 'username email role' },
            { path: 'category', select: 'name _id' }
        ])

        return res.status(200).json({
            success: true,
            message: "Product updated succesfully",
            product,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

export async function deleteProduct(req, res) {

    try {
        const { id } = req.params
        const sellerID = req.user.id

        const product = await Product.findById(id)

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        if (product?.image?.public_id) {
            await deleteImage(product?.image?.public_id);
        }
        await Product.findByIdAndDelete(id)
        await Seller.findByIdAndUpdate(sellerID, { $pull: { products: id } });

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            productId: id,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

export async function settoggleProductStatus(req, res) {

    try {
        const { id } = req.params
        const { newStatus } = req.body


        const updatedProduct = await Product.findByIdAndUpdate(id, { active: newStatus }, { new: true })
            .populate('seller', 'username email role');

        if (!updatedProduct) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product: updatedProduct
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}



