import { deleteImage, uploadImage } from "../utils/cloudinaryHandler.js"

export const uploadImageController = async (req, res) => {
    try {
        const result = await uploadImage(req.file.buffer);
        res.status(200).json({ success: true, image: { url: result.url, public_id: result.public_id } });
    } catch (error) {
        res.status(500).json({ success: false, message: "Upload failed" });
        console.log(error);
    }
};



export const deleteImageController = async (req, res) => {
    try {
        const { public_id } = req.body;
        const result = await deleteImage(public_id);
        res.status(200).json({ success: true, result });
    } catch (error) {
        res.status(500).json({ success: false, message: "Delete failed" });
        console.log(error);
    }
};


