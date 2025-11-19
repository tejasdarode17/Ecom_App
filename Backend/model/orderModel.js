import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                seller: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Seller",
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                },

                lockedPrice: {
                    type: Number,
                    default: null,
                },

                subtotal: {
                    type: Number,
                    required: true,
                },


                sellerAmount: {
                    type: Number,
                    required: true,
                },

                status: {
                    type: String,
                    enum: ["ordered", "packed", "shipped", "out-for-delivery", "delivered", "cancelled",],
                    default: "ordered",
                },

                payoutStatus: {
                    type: String,
                    enum: ["pending", "scheduled", "paid", "refunded"],
                    default: "pending",
                },

                deliveryPartner: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "DeliveryPartner",
                    default: null,
                },

                deliveryStatus: {
                    type: String,
                    enum: ["pending", "assigned", "picked", "out-for-delivery", "delivered", "failed"],
                    default: "pending",
                },

            },
        ],

        orderStatus: {
            type: String,
            enum: ["pending", "partially-delivered", "delivered", "cancelled"],
            default: "pending",
        },

        orderPayoutStatus: {
            type: String,
            enum: ["pending", "scheduled", "paid", "refunded"],
            default: "pending"
        },

        amount: {
            type: Number,
            required: true,
        },

        address: {
            type: Object,
        },

        currency: {
            type: String,
            default: "INR",
        },

        razorpay: {
            orderId: String,
            paymentId: String,
            signature: String,
        },

        paymentMode: {
            type: String,
            enum: ["prepaid", "cod"],
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "refunded"],
            default: "pending",
        },

        refundId: String,
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
