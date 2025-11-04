import mongoose from "mongoose"

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,
        unique: true
    },

    addresses: [
        {
            name: { type: String, required: true },
            phoneNumber: { type: String },
            pinCode: { type: String, required: true },
            locality: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            landmark: { type: String, required: true },
            label: { type: String, default: "Home" },
            isDefault: { type: Boolean, default: false },
        },
    ],

    role: {
        type: String,
        default: 'user'
    },

    viewedProducts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],

    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        }
    ],
    orders: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
        }
    ],

    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cart",
        default: null
    }

})


const User = mongoose.model('User', userSchema)

export default User