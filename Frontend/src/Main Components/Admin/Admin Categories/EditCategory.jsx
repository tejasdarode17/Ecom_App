import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import useUploadImage from "@/Custom Hooks/useUploadImage";
import axios from "axios";
import CategoryForm from "./CategoryForm";

const EditCategory = ({ cat }) => {

    const [editLoading, setLoading] = useState(false)
    const { uploadImageToServer } = useUploadImage()

    async function editCategory(formData, setformData, id) {
        try {
            setLoading(true)

            //only upload if the image is file 
            let uploadedImage = formData.image;
            if (formData.image && formData.image instanceof File) {
                uploadedImage = await uploadImageToServer(formData.image);
            }

            const payload = {
                name: formData.name,
                description: formData.description,
                image: uploadedImage
            }
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-category/${id}`, payload, {
                withCredentials: true,
            });
            setformData({ name: "", description: "", image: null })
            setLoading(false)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                    <Pencil className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Category</DialogTitle>
                    <DialogDescription>Edit details and save</DialogDescription>
                </DialogHeader>
                <CategoryForm initialData={cat} loading={editLoading} onSubmit={editCategory} />
            </DialogContent>
        </Dialog>
    )
}

export default EditCategory