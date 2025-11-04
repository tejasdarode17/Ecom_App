import { useState } from "react";
import useUploadImage from "@/Custom Hooks/useUploadImage";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import { useLocation, useNavigate, } from "react-router-dom";
import { StepBack } from "lucide-react";
import { Button } from "@/components/ui/button";

const EditCategory = () => {

    const [editLoading, setLoading] = useState(false)
    const { uploadImageToServer } = useUploadImage()
    const location = useLocation();
    const cat = location.state?.cat;
    const navigate = useNavigate()

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
                image: uploadedImage,
                attributes: formData.attributes
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/edit-category/${id}`, payload, {
                withCredentials: true,
            });
            console.log(response?.data);
            setformData({ name: "", description: "", image: null, attributes: [] })
            setLoading(false)
            navigate("/admin/category")
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Edit Category</h1>
                <Button variant="outline" className="pointer" onClick={() => navigate("/admin/category")} ><StepBack></StepBack>Back</Button>
            </div>


            <div className="mt-10">
                <CategoryForm initialData={cat} loading={editLoading} onSubmit={editCategory} />
            </div>
        </div>
    )
}

export default EditCategory