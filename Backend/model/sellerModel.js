import mongoose from "mongoose"

const sellerSchema = new mongoose.Schema({

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

    businessAddress: {
        type: String,
        required: true
    },

    role: {
        type: String,
        default: 'seller'
    },


    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        }
    ]

})


const Seller = mongoose.model('Seller', sellerSchema)

export default Seller