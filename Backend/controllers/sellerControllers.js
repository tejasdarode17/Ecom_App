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
        let { category = "all", status = "all", search = "", page = 1 } = req.query;

        if (req.user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        page = Number(page);
        const limit = 10

        const filterQuery = { seller: sellerId };

        if (status && status !== "all") {
            filterQuery.active = status === "active";
        }

        if (category && category !== "all") {
            filterQuery.category = category;
        }

        if (search.trim() !== "") {
            filterQuery.name = { $regex: search, $options: "i" };
        }

        const filteredTotal = await Product.countDocuments(filterQuery);
        const totalProducts = await Product.countDocuments({ seller: sellerId });
        const products = await Product.find(filterQuery)
            .populate("category", "name _id")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            products,
            totalProducts,
            filteredTotal,
            page,
            pages: Math.ceil(filteredTotal / limit),
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

export async function toggleProductStatus(req, res) {
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
            status: product.active
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



// --------Orders Apis----------------------------------
export async function fetchSellerOrders(req, res) {
    try {
        const sellerID = req.user.id;
        const { page = 1, range = "all" } = req.query;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }


        const limit = 10;
        const skip = (page - 1) * limit;

        let dateFilter = {};
        if (range === "today") {
            const start = new Date();
            start.setHours(0, 0, 0, 0);

            const end = new Date();
            end.setHours(23, 59, 59, 999);

            dateFilter = { createdAt: { $gte: start, $lte: end } };
        }

        if (range === "thisMonth") {
            const now = new Date();
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

            dateFilter = { createdAt: { $gte: start, $lte: end } };
        }

        const query = { "items.seller": sellerID, ...dateFilter };
        const totalOrders = await Order.countDocuments(query);

        const orders = await Order.find(query)
            .populate("customer", "username email addresses")
            .populate("items.product", "name price images")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        const formattedOrders = orders.map(order => {
            const sellerItems = order.items.filter((it) => it.seller.toString() === sellerID.toString());
            const sellerTotalAmount = sellerItems.reduce((sum, it) => sum + it.sellerAmount, 0);
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
        });

        return res.status(200).json({
            success: true,
            orders: formattedOrders,
            page: Number(page),
            totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
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

export async function fetchRecetTenOrders(req, res) {
    try {
        const sellerID = req.user.id;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized",
            });
        }

        const orders = await Order.find({ "items.seller": sellerID })
            .sort({ createdAt: -1 })
            .limit(5);

        const sellerActualOrders = orders.map((order) => {
            const sellerItems = order.items.filter((it) => it.seller.toString() === sellerID.toString());
            const sellerTotalAmount = sellerItems.reduce((sum, it) => sum + it.sellerAmount, 0);
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
        });

        return res.status(200).json({
            success: true,
            message: "Fetched Recent Orders",
            orders: sellerActualOrders,
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

export async function fetchSellerStats(req, res) {
    try {
        const sellerID = req.user.id;

        if (!sellerID) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const orders = await Order.find({ "items.seller": sellerID })
            .populate("items.product", "name price")
            .sort({ createdAt: -1 });

        let totalRevenue = 0;
        let todayRevenue = 0;
        let monthRevenue = 0;

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        orders.forEach(order => {
            const sellerItems = order.items.filter(
                (it) => it.seller.toString() === sellerID.toString()
            );

            const sellerTotal = sellerItems.reduce((sum, it) => sum + it.sellerAmount, 0);

            totalRevenue += sellerTotal;

            if (order.createdAt >= todayStart && order.createdAt <= todayEnd) {
                todayRevenue += sellerTotal;
            }

            if (order.createdAt >= monthStart && order.createdAt <= monthEnd) {
                monthRevenue += sellerTotal;
            }
        });

        return res.status(200).json({
            success: true,
            totalRevenue,
            todayRevenue,
            monthRevenue,
            totalOrders: orders.length
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

        if (item.deliveryPartner) {
            return res.status(403).json({
                success: false,
                message: "This product is already assigned to a delivery partner"
            });
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
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: error.message });
    }
}

export async function fetchAllDeliveryPartners(req, res) {

    try {
        const sellerId = req.user.id

        if (!sellerId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized"
            });
        }

        const deliveyPartners = await DeliveryPartner.find()

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

// --------------------------------------------------------------------------










