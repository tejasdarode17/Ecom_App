import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    description: {
        type: String,
        default: "",
    },

    image: {
        url: {
            type: String,
            default: "",
        },
        public_id: {
            type: String,
            default: "",
        }
    },

    active: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

const Category = mongoose.model("Category", categorySchema);

export default Category;
