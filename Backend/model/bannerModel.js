import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            require: true,
            unique: true
        },
        image: {
            url: { type: String, required: true },
            public_id: { type: String }
        },
        link: {
            type: String,
            default: "#"
        },
        status: {
            type: String,
            enum: ["active", "inactive"],
            default: "active"
        },
    },
    { timestamps: true }
);



const Bannner = mongoose.model("Banner", bannerSchema);

export default Bannner
