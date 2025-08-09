import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    category: {
        type: String,
        required: true,
    },

    image: {
        url: {
            type: String,
            required: true,
        },
        public_id: {
            type: String,
            required: true,
        },
    },

    brand: {
        type: String,
        default: ""
    },

    stock: {
        type: Number,
        required: true,
        min: 0
    },

    price: {
        type: Number,
        required: true,
        min: 0
    },

    salePrice: {
        type: Number,
        default: 0
    },

    description: {
        type: String,
        default: ""
    },


    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Seller",
        required: true
    }

}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);

export default Product;


