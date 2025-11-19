import DeliveryPartner from "../model/deliveryPartnerModel.js";
import Order from "../model/orderModel.js";

export async function fetchPartnerOrders(req, res) {
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

        const response = orders.map(order => {
            const assignedItem = partner.orders.find(o => o.orderId.toString() === order._id.toString());
            const item = order.items.find(i => i._id.toString() === assignedItem.itemId.toString());
            return {
                orderId: order._id,
                item,
                address: order.address,
                customer: order.customer,
                deliveryStatus: order.deliveryStatus,
                paymentMode: order.paymentMode,
                paymentStatus: order.paymentStatus,
                createdAt: order.createdAt
            };
        });

        return res.status(200).json({
            success: true,
            orders: response
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
