import { v2 as cloudinary } from "cloudinary"

export async function uploadImage(buffer) {
    try {
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "Ecom",
                    resource_type: "image",
                    transformation: [{ quality: "auto:eco" }]
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            ).end(buffer);
        });

        return result;
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteImage(publicID) {
    try {

        const result = await cloudinary.uploader.destroy(publicID, {
            folder: "Ecom",
            resource_type: "image"
        })
        return result
    } catch (error) {
        console.log(error);
    }
}

