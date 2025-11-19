import Cart from "../model/cartModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";

export async function fetchSearchSuggestions(req, res) {
    try {
        let search = req.query.search?.trim();
        if (!search || search.length < 2) {
            return res.json({ success: true, products: [] });
        }

        const products = await Product.find({
            $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ],
        }).limit(10).select("name brand slug")
        return res.json({ success: true, products });
    } catch (error) {
        console.error("Error in fetchSearchSuggestions:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}



export async function fetchSearchProducts(req, res) {
    try {
        const { search, page = 1, sort = "relevance" } = req.query;
        const limit = 5

        if (!search) {
            return res.json({ success: false, products: [] });
        }

        const query = {
            active: true,
            // outOfStock: false,
            $or: [
                { name: { $regex: search, $options: "i" } },
                { brand: { $regex: search, $options: "i" } },
            ]
        };

        let sortOptions = {}
        if (sort === "price_high_to_low") sortOptions = { price: -1 }
        if (sort === "price_low_to_high") sortOptions = { price: 1 }
        if (sort === "latest") sortOptions = { createdAt: -1 }

        const skip = (Number(page) - 1) * Number(limit)

        const products = await Product.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .populate("seller")
            .populate("category")

        const total = await Product.countDocuments(query);

        if (!products.length) {
            return res.json({
                success: true,
                products: [],
                total: 0,
                currentPage: Number(page),
                totalPages: 0,
                message: "No products found",
            });
        }

        return res.json({
            success: true,
            products,
            total,
            currentPage: Number(page),
            totalPages: Math.ceil(total / limit),
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function addAddress(req, res) {

    try {
        const useID = req.user.id
        const { name, phoneNumber, pinCode, locality, address, city, state, landmark, label, isDefault } = req.body

        const user = await User.findById(useID)

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!name || !phoneNumber || !pinCode || !address || !city || !state) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields.",
            });
        }
        const newAddress = {
            name,
            phoneNumber,
            pinCode,
            locality,
            address,
            city,
            state,
            landmark,
            label: label || "Home",
            isDefault: isDefault || false,
        };


        if (user.addresses.length === 0) {
            newAddress.isDefault = true;
        }
        if (newAddress.isDefault) {
            user.addresses.forEach((addr) => (addr.isDefault = false));
        }

        user.addresses.push(newAddress);
        await user.save();

        return res.status(201).json({
            success: true,
            message: "Address added successfully!",
            address: newAddress,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function editAddress(req, res) {
    try {
        const userID = req.user.id
        const addressId = req.params.id
        const { name, phoneNumber, pinCode, locality, address, city, state, landmark, label, isDefault } = req.body

        const user = await User.findById(userID)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (!addressId) {
            return res.status(404).json({ success: false, message: "AddressID not sent" });
        }

        const existingAddress = user.addresses.find(addr => addr._id.toString() === addressId);
        if (!existingAddress) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }


        if (name) existingAddress.name = name;
        if (phoneNumber) existingAddress.phoneNumber = phoneNumber;
        if (pinCode) existingAddress.pinCode = pinCode;
        if (locality) existingAddress.locality = locality;
        if (address) existingAddress.address = address;
        if (city) existingAddress.city = city;
        if (state) existingAddress.state = state;
        if (landmark) existingAddress.landmark = landmark;
        if (label) existingAddress.label = label;

        if (isDefault !== undefined) {
            existingAddress.isDefault = isDefault;

            //rest need to marked false
            if (isDefault === true) {
                user.addresses.forEach(addr => {
                    if (addr._id.toString() !== addressId) {
                        addr.isDefault = false;
                    }
                });
            }
        }

        await user.save()

        return res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address: existingAddress
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function addCart(req, res) {
    try {
        const userID = req.user.id
        const { productID, quantity = 1, attributes } = req.body

        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productID);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.stock <= 0) {
            return res.status(404).json({ message: "Sorry this product is out of stock" });
        }

        const priceAtTheTime = product.salePrice > 0 ? product.salePrice : product.price;

        let cart = await Cart.findOne({ user: userID })

        if (!cart) {
            cart = await Cart.create({ user: userID, items: [] });
        }

        const existingItem = cart.items.find((item) => item.product == productID && JSON.stringify(item.attributes) === JSON.stringify(attributes || {}))

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({
                product: productID,
                quantity,
                priceAtTheTime,
                attributes: attributes || {}
            });
        }

        let itemTotalAmmount = cart.items.reduce((sum, item) => sum + item.quantity * item?.priceAtTheTime, 0);
        let platformFees = 100
        let deliveryFees = itemTotalAmmount > 500 ? 0 : 50

        cart.itemTotal = itemTotalAmmount
        cart.platformFees = platformFees
        cart.deliveryFees = deliveryFees
        cart.totalAmmount = itemTotalAmmount + platformFees + deliveryFees

        await cart.save()
        const populatedCart = await cart.populate("items.product");

        return res.status(200).json({
            success: true,
            message: "Item Added",
            cart: populatedCart
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function deleteCart(req, res) {
    try {
        const userID = req.user.id;

        const cart = await Cart.findOne({ user: userID });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        await cart.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Cart deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function fetchCart(req, res) {
    try {
        const userID = req.user.id;

        const cart = await Cart.findOne({ user: userID })
            .populate({
                path: "items.product",
                options: { strictPopulate: false }
            });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found",
            });
        }

        cart.items.forEach(item => {

            if (!item.product) {
                item.unavailable = true;
                item.stockIssue = false;
                item.lockedPrice = null;
                return;
            }

            if (item.product.stock < item.quantity) {
                item.unavailable = true;
                item.stockIssue = true;
                item.lockedPrice = null;
                cart.issues = true
                return;
            }

            item.unavailable = false;
            item.stockIssue = false;
            cart.issues = false

        });

        //as soon as user refresh the totalAmmount will always comes from latest price 
        let itemTotal = cart.items.reduce((sum, item) => {
            if (item.unavailable) return sum;
            const currentPrice = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
            return sum + item.quantity * currentPrice
        }, 0);

        cart.itemTotal = itemTotal
        cart.totalAmmount = itemTotal + cart.platformFees + cart.deliveryFees;
        cart.save()

        return res.status(200).json({
            success: true,
            message: "Cart Fetched",
            cart,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}

export async function checkOut(req, res) {
    try {
        const userID = req.user.id;
        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const cart = await Cart.findOne({ user: userID }).populate("items.product");
        if (!cart) return res.status(404).json({ message: "Cart not found" });

        let hasIssues = false;

        cart.items.forEach(item => {

            if (!item.product) {
                item.unavailable = true;
                item.stockIssue = false;
                item.lockedPrice = null;
                hasIssues = true;
                return;
            }

            if (item.product.stock < item.quantity) {
                item.unavailable = true;
                item.stockIssue = true;
                item.lockedPrice = null;
                hasIssues = true;
                return;
            }

            item.unavailable = false;
            item.stockIssue = false;

            const frozenPrice = item.product.salePrice > 0 ? item.product.salePrice : item.product.price;
            item.lockedPrice = frozenPrice;
        });

        await cart.save();

        if (hasIssues) {
            return res.status(400).json({
                success: false,
                message: "Some items need your attention",
            });
        }

        let total = cart.items.reduce((sum, item) => sum + item.lockedPrice * item.quantity, 0);
        cart.itemTotal = total

        cart.deliveryFees = total > 500 ? 0 : 50
        cart.platformFees = 100

        const finalAmount = total + cart.deliveryFees + cart.platformFees
        cart.totalAmmount = finalAmount
        cart.finalPayable = finalAmount
        await cart.save();

        return res.status(200).json({
            success: true,
            message: "Checkout ready",
            cart
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: err.message,
        });
    }
}

export async function buyNow(req, res) {
    try {
        const userID = req.user.id
        const { productID, quantity = 1, attributes } = req.body

        const user = await User.findById(userID);
        if (!user) return res.status(404).json({ message: "User not found" });

        const product = await Product.findById(productID);
        if (!product) return res.status(404).json({ message: "Product not found" });

        if (product.stock < quantity) {
            return res.status(400).json({ message: "Product out of stock" })
        }

        const lockedPrice = product.salePrice > 0 ? product.salePrice : product.price;
        const total = lockedPrice * quantity
        let platformFees = 100
        let deliveryFees = total > 500 ? 0 : 50
        let finalPayable = total + platformFees + deliveryFees

        const buyNowItem = {
            productID: product._id,
            product,
            name: product.name,
            image: product.images[0]?.url,
            brand: product.brand,
            attributes,
            itemTotal: lockedPrice,
            deliveryFees,
            platformFees,
            quantity,
            finalPayable
        };

        return res.status(200).json({
            success: true,
            message: "Buy now item ready",
            item: buyNowItem,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }
}


export async function getAllOrders(req, res) {

    try {
        const userID = req.user.id

        const orders = await Order.find({ customer: userID })
            .populate("items.product")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "orders fetched",
            orders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        });
    }


}


