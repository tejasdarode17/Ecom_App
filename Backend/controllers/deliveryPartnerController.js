import DeliveryPartner from "../model/deliveryPartnerModel.js";
import Order from "../model/orderModel.js";

export async function fetchPartnerAllOrders(req, res) {
    try {
        const partnerID = req.user.id;

        if (!partnerID) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const partner = await DeliveryPartner.findById(partnerID);
        if (!partner) {
            return res.status(404).json({ success: false, message: "Delivery partner not found" });
        }

        const orderIds = partner.orders.map(o => o.orderId);

        const orders = await Order.find({ _id: { $in: orderIds } })
            .populate("customer", "username email")
            .populate("items.product", "name price images");

        const response = partner.orders.map(assigned => {
            const order = orders.find(o => o._id.toString() === assigned.orderId.toString());
            if (!order) return null;

            const item = order.items.id(assigned.itemId);
            if (!item) return null;

            return {
                orderId: order._id,
                item,
                address: order.address,
                customer: order.customer,
                deliveryStatus: item.deliveryStatus,
                paymentMode: order.paymentMode,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt
            };
        })

        return res.status(200).json({
            success: true,
            orders: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}


export async function fetchPartnerPendingOrders(req, res) {
    try {
        const partnerID = req.user.id;

        if (!partnerID) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const partner = await DeliveryPartner.findById(partnerID);
        if (!partner) {
            return res.status(404).json({ success: false, message: "Delivery partner not found" });
        }

        const orderIds = partner.orders.map(o => o.orderId);

        const orders = await Order.find({ _id: { $in: orderIds } })
            .populate("customer", "username email")
            .populate("items.product", "name price images");

        const response = partner.orders
            .map(assigned => {
                const order = orders.find(o => o._id.toString() === assigned.orderId.toString());
                if (!order) return null;

                const item = order.items.id(assigned.itemId);
                if (!item || item.status === "delivered") return null;

                return {
                    orderId: order._id,
                    item,
                    address: order.address,
                    customer: order.customer,
                    deliveryStatus: item.deliveryStatus,
                    paymentMode: order.paymentMode,
                    paymentStatus: order.paymentStatus,
                    createdAt: order.createdAt
                };
            })
            .filter(Boolean); // remove all nulls

        return res.status(200).json({
            success: true,
            orders: response
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}



export async function updateDeliveryStatus(req, res) {
    try {
        const partnerID = req.user.id;
        const { orderId, itemId, status } = req.body;

        if (!orderId || !itemId || !status) {
            return res.status(400).json({
                success: false,
                message: "orderId, itemId, and status are required"
            });
        }

        const partner = await DeliveryPartner.findById(partnerID);
        if (!partner) {
            return res.status(404).json({ success: false, message: "Delivery partner not found" });
        }

        const assigned = partner.orders.find(o => o.orderId.toString() === orderId && o.itemId.toString() === itemId);
        if (!assigned) {
            return res.status(403).json({
                success: false,
                message: "You are not assigned to this order item"
            });
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        // Find item
        // const item = order.items.find(i => i._id.toString() === itemID);
        //this is provided my mongoose insted of find we can use this also 
        const item = order.items.id(itemId);
        if (!item) {
            return res.status(404).json({ success: false, message: "Item not found" });
        }

        item.deliveryStatus = status;

        if (status === "picked") {
            item.status = "shipped"
        } else {
            item.status = status
        }
        
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Delivery status updated successfully",
            item
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
