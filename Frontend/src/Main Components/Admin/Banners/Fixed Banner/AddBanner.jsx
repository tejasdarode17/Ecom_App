import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BannerForm from "./BannerForm";
import { useState } from "react";
import useUploadImage from "@/Custom Hooks/useUploadImage";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addBanners } from "@/Redux/bannersSlice";

const AddBanner = () => {
    const [loading, setLoading] = useState(false)
    const { uploadImageToServer } = useUploadImage()
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const [error, setError] = useState(null)
    async function handleSubmit(bannerFrom, setBannerForm) {
        try {
            setLoading(true);
            const uploadedImage = await uploadImageToServer(bannerFrom?.image);
            const payload = {
                type: bannerFrom.type,
                image: uploadedImage,
                link: bannerFrom.link,
            };
            const respone = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-banner`, payload, {
                withCredentials: true,
            });
            console.log(respone);
            dispatch(addBanners(respone?.data?.banner))
            setOpen(false);
        } catch (error) {
            console.log(error);
            setError(error?.response?.data?.message || "Something went wrong on the server. Please try again later.")
        } finally {
            setLoading(false);
        }
    }


    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button variant="outline">
                        Add Banner
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Banner</DialogTitle>
                        <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <BannerForm onSubmit={handleSubmit} error={error} loading={loading}></BannerForm>
                </DialogContent>
            </Dialog>
        </>
    )
}


export default AddBanner


