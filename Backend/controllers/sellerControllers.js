import Seller from "../model/sellerModel.js";
import Product from "../model/productModel.js";
import { deleteImage, deleteImages } from "../utils/cloudinaryHandler.js";
import Category from "../model/categoryModel.js";
import slugify from "slugify";
import Order from "../model/orderModel.js";
import mongoose from "mongoose";
import DeliveryPartner from "../model/deliveryPartnerModel.js";

export async function addProduct(req, res) {

    const { name, category, images, brand, highlights, description, stock, price, salePrice, attributes, } = req.body;
    const sellerID = req.user.id;
    try {
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

        if (isNaN(stock) || Number(stock) < 0) {
            return res.status(400).json({ success: false, message: "Invalid stock value" });
        }

        if (isNaN(price) || Number(price) < 0) {
            return res.status(400).json({ success: false, message: "Invalid price value" });
        }

        if (salePrice && (isNaN(salePrice) || salePrice < 0 || salePrice > price)) {
            return res.status(400).json({
                success: false,
                message: "Invalid sale price",
            });
        }

        const seller = await Seller.findById(sellerID);
        if (!seller || seller.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to add a product",
            });
        }
        // -----------------------------------------------------------------------------------
        // cheking if any required attribute is not sent 
        const categoryDoc = await Category.findById(category);
        if (!categoryDoc) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

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
        // --------------------------------------------------------------------------------------------------

        const productID = new mongoose.Types.ObjectId();
        const productSlug = slugify(`${brand}-${name}-${productID}`, {
            lower: true,
            strict: true,
        });

        const product = await Product.create(
            {
                _id: productID,
                name,
                category,
                brand,
                highlights,
                description,
                images,
                price: Number(price),
                salePrice: salePrice || 0,
                stock: Number(stock),
                attributes,
                seller: sellerID,
                slug: productSlug,
            },
        );

        seller.products.push(productID);
        await seller.save();
        const populated = await Product.findById(productID)
            .populate({ path: "seller", select: "username email role" })
            .populate({ path: "category", select: "name attributes" });

        return res.status(201).json({
            success: true,
            message: "Product added successfully",
            product: populated,
        });

    } catch (error) {
        if (images?.length) {
            const publicIDs = images.map(img => img.public_id);
            await deleteImages(publicIDs);
        }
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
        const { name, images, brand, highlights, description, stock, price, salePrice, attributes } = req.body;

        const seller = await Seller.findById(sellerID);
        if (!seller || seller.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        // --------------------------------------------------------------------------------------------------------
        // checking if any required attributes not sent 
        const categoryDoc = await Category.findById(product.category);
        if (!categoryDoc) {
            return res.status(400).json({
                success: false,
                message: "Category does not exist"
            });
        }
        if (categoryDoc.attributes?.length) {
            const missing = categoryDoc.attributes.find(
                (attr) => attr.required && !attributes?.[attr.name]
            );

            if (missing) {
                return res.status(400).json({
                    success: false,
                    message: `Attribute "${missing.name}" is required`
                });
            }
        }

        // -------------------------------------------------------------------------------------------------------------
        if (stock != null) {
            if (isNaN(stock) || Number(stock) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid stock value"
                });
            }
            product.stock = Number(stock);
        }

        if (price != null) {
            if (isNaN(price) || Number(price) < 0) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid price value"
                });
            }
            product.price = Number(price);
        }

        if (salePrice != null) {
            if (
                isNaN(salePrice) ||
                Number(salePrice) < 0 ||
                Number(salePrice) > (price ?? product.price)
            ) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid sale price"
                });
            }
            product.salePrice = Number(salePrice);
        }


        if (name) product.name = name.trim();
        if (brand) product.brand = brand.trim();
        if (highlights) product.highlights = highlights;
        if (description) product.description = description;
        if (attributes) product.attributes = attributes;

        if (images?.length) {
            const incomingPublicIds = images.map((img) => img.public_id);
            const toDelete = product.images.filter(
                (img) => !incomingPublicIds.includes(img.public_id)
            );

            for (const img of toDelete) {
                try {
                    await deleteImage(img.public_id);
                } catch (err) {
                    console.error("Image deletion failed:", err.message);
                }
            }

            product.images = images;
        }


        if (name || brand) {
            product.slug = slugify(
                `${product.brand}-${product.name}-${id}`,
                { lower: true, strict: true }
            );
        }

        await product.save();
        await product.populate([
            { path: "seller", select: "username email role" },
            { path: "category", select: "name attributes _id" }
        ]);

        return res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const sellerID = req.user.id;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        if (product.images?.length > 0) {
            const publicIDs = product.images.map(img => img.public_id);
            await deleteImages(publicIDs);
        }

        await Product.findByIdAndDelete(id);
        await Seller.findByIdAndUpdate(sellerID, { $pull: { products: id } });

        return res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            productId: id
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function getAllSellerProducts(req, res) {
    try {
        const sellerId = req.user.id;

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const products = await Product.find({ seller: sellerId })
            .populate("category", "name _id")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function getSellerSingleProduct(req, res) {
    try {
        const sellerID = req.user.id;
        const { id } = req.params;

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const product = await Product.findById(id)
            .populate("category", "name _id");

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function settoggleProductStatus(req, res) {
    try {
        const sellerID = req.user.id;
        const { id } = req.params;
        const { newStatus } = req.body;

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        if (typeof newStatus !== "boolean") {
            return res.status(400).json({
                success: false,
                message: "newStatus must be true or false"
            });
        }

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        if (product.seller.toString() !== sellerID) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized"
            });
        }

        product.active = newStatus;
        await product.save();

        return res.status(200).json({
            success: true,
            message: "Product status updated",
            product
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


// --------------------------------------------------------------------------------------------
//this is helper i created for finding seller actual products and sending consistent data.
//in all the api who is updating any order 
//so that we dont have to do lot of of stuff in redux we can simply change this order with the old in redux 
export function formatSellerOrder(order, sellerID) {
    if (!order) return null;

    const sellerItems = order.items.filter(
        (item) => item.seller.toString() === sellerID.toString()
    );
    const sellerTotalAmount = sellerItems.reduce((acc, curr) => acc + curr.sellerAmount, 0);

    return {
        _id: order._id,
        customer: order.customer,
        items: sellerItems,
        sellerTotalAmount,
        paymentMode: order.paymentMode,
        paymentStatus: order.paymentStatus,
        address: order.address,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
    };
}

export async function fetchSellerOrders(req, res) {
    try {
        const sellerID = req.user.id;

        const orders = await Order.find({ "items.seller": sellerID })
            .populate("customer", "username email addresses")
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 });

        const formattedOrders = orders.map(order =>
            formatSellerOrder(order, sellerID)
        );

        return res.status(200).json({
            success: true,
            message: "Orders fetched",
            orders: formattedOrders
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}

export async function changeOrderStatus(req, res) {
    try {
        const sellerID = req.user.id;
        const { orderID, itemID, newStatus } = req.body;

        const order = await Order.findById(orderID)
            .populate("customer", "username email addresses")
            .populate("items.product", "name price images");

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        const item = order.items.find(i => i._id.toString() === itemID);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        if (item.seller.toString() !== sellerID) {
            return res.status(403).json({ message: "Item does not belong to seller" });
        }

        item.status = newStatus;
        await order.save();

        return res.status(200).json({
            success: true,
            order: formatSellerOrder(order, sellerID)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function assignOrderToDeliveryPartner(req, res) {

    try {
        const sellerID = req.user.id;
        const { orderID, itemID, partnerID } = req.body;

        const partner = await DeliveryPartner.findById(partnerID);
        if (!partner) {
            return res.status(404).json({ success: false, message: "Invalid partner" });
        }

        const order = await Order.findById(orderID)
            .populate("customer", "username email addresses")
            .populate("items.product", "name price images");

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        const item = order.items.find(i => i._id.toString() === itemID);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found." });
        }

        if (item.seller.toString() !== sellerID) {
            return res.status(403).json({ success: false, message: "Unauthorized seller" });
        }

        // Assign delivery partner
        item.deliveryPartner = partnerID;
        item.deliveryStatus = "assigned";
        await order.save();

        // Add to partner's order list
        partner.orders.push({
            orderId: orderID,
            itemId: itemID
        });
        await partner.save();

        return res.status(200).json({
            success: true,
            message: "Delivery Partner Assigned",
            order: formatSellerOrder(order, sellerID)
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

// above apis is using that formatSellerOrder
// --------------------------------------------------------------------------


export async function fetchAllDeliveryPartners(req, res) {

    try {
        const sellerId = req.user.id
        console.log(sellerId);

        if (!sellerId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const deliveyPartners = await DeliveryPartner.find()
        console.log(deliveyPartners);

        if (!deliveyPartners) {
            return res.status(403).json({
                success: false,
                message: "No partners found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "All delivery Partner Fetched",
            partners: deliveyPartners
        });


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });
    }
}







