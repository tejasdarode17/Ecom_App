import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react"
import CarouselForm from "./CarouselForm";
import useUploadImages from "@/Custom Hooks/useUploadImages";
import axios from "axios";



const EditCarousal = ({ carousel }) => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { uploadImagesToServer } = useUploadImages()

    async function handleSubmit(carousalType, carouselImages, id) {
        try {
            setLoading(true);

            let uploadedImages = [];
            const newFiles = carouselImages.filter(img => img instanceof File);
            const existingImages = carouselImages.filter(img => img.url);

            if (newFiles.length > 0) {
                const uploaded = await uploadImagesToServer(newFiles);
                uploadedImages = [...existingImages, ...uploaded];
            } else {
                uploadedImages = existingImages;
            }

            const payload = {
                title: carousalType,
                images: uploadedImages
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-carousel/${id}`, payload, {
                withCredentials: true,
            });

            console.log(response.data);
            setOpen(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
            setOpen(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Edit Carousel</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Carousel</DialogTitle>
                </DialogHeader>
                <CarouselForm onSubmit={handleSubmit} initialData={carousel} loading={loading}></CarouselForm>
            </DialogContent>
        </Dialog >
    )
}


export default EditCarousal


