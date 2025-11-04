import Seller from "../model/sellerModel.js";
import Product from "../model/productModel.js";
import { deleteImage } from "../utils/cloudinaryHandler.js";
import Category from "../model/categoryModel.js";
import slugify from "slugify";

export async function addProduct(req, res) {
    try {
        const { name, category, images, brand, highlights, description, stock, price, salePrice, attributes, } = req.body;

        const sellerID = req.user.id;


        if (!name || !category || !brand || !description || stock == null || price == null) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields",
            });
        }

        if (!images?.length) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required",
            });
        }

        const seller = await Seller.findById(sellerID);
        if (!seller || seller.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to add a product",
            });
        }

        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        // --- Attribute Validation --- checking if that category is req or not 
        if (categoryDoc.attributes?.length) {
            const missing = categoryDoc.attributes.find(
                (attr) => attr.required && !attributes?.[attr.name]
            );
            if (missing) {
                return res.status(400).json({
                    success: false,
                    message: `Attribute "${missing.name}" is required`,
                });
            }
        }

        const product = new Product({
            name,
            category,
            images,
            brand,
            highlights,
            description,
            stock: Number(stock),
            price,
            salePrice: salePrice || 0,
            attributes,
            seller: sellerID,
            slug: name + category
        });

        await product.save();
        product.slug = slugify(`${brand}-${name}-${product._id}`, { lower: true, strict: true });
        await product.save();


        await product.populate([
            { path: "seller", select: "username email role" },
            { path: "category", select: "name attributes" },
        ]);

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function editProduct(req, res) {
    try {
        const { id } = req.params;
        const sellerID = req.user.id;
        const { name, category, images, brand, highlights, description, stock, price, salePrice, attributes, } = req.body;
        const seller = await Seller.findById(sellerID);
        if (!seller || seller.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized or not a seller",
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (name) product.name = name;
        if (category) product.category = category;
        if (brand) product.brand = brand;
        if (highlights) product.highlights = highlights;
        if (description) product.description = description;
        if (stock != null) product.stock = Number(stock);
        if (price != null) product.price = price;
        if (salePrice != null) product.salePrice = salePrice;
        if (attributes) product.attributes = attributes;

        // --- Handle image update ---
        if (images?.length) {
            const incomingPublicIds = images.map((img) => img.public_id);
            const imagesToDelete = product.images.filter(
                (img) => !incomingPublicIds.includes(img.public_id)
            );

            for (const img of imagesToDelete) {
                await deleteImage(img.public_id);
            }

            product.images = images;
        }

        if (brand || name) {
            product.slug = slugify(`${brand || product.brand}-${name || product.name}-${id}`, { lower: true, strict: true });
        }

        await product.save();

        await product.populate([
            { path: "seller", select: "username email role" },
            { path: "category", select: "name _id" },
        ]);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
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

        if (product?.seller?.toString() !== sellerID) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        if (product?.images?.length > 0) {
            for (const img of product.images) {
                deleteImage(img?.public_id)
            }
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



