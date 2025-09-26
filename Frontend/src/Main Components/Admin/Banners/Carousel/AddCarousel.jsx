import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react"
import CarouselForm from "./CarouselForm";
import useUploadImages from "@/Custom Hooks/useUploadImages";
import axios from "axios";



const AddCarousal = () => {

    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { uploadImagesToServer } = useUploadImages()
    async function handleSubmit(carousalType, carouselImages) {
        try {
            setLoading(true);
            const images = await uploadImagesToServer(carouselImages)
            const payload = {
                title: carousalType,
                images: images
            }
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-carousel`, payload, {
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
                <Button variant="outline">Add Carousel</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Carousel</DialogTitle>
                </DialogHeader>
                <CarouselForm onSubmit={handleSubmit} loading={loading}></CarouselForm>
            </DialogContent>
        </Dialog >
    )
}

export default AddCarousal


