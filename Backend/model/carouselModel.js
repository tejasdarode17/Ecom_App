import { mongoose } from "mongoose";

const carouselSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true
        },
        images: [
            {
                url: { type: String, required: true },
                public_id: { type: String, required: true },
            },
        ],
    },
    { timestamps: true }
);



const Carousel = mongoose.model("Carousel", carouselSchema)

export default Carousel