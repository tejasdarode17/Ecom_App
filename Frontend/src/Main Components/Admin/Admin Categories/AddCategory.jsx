import { useState } from "react";
import useUploadImage from "@/Custom Hooks/useUploadImage";
import axios from "axios";
import CategoryForm from "./CategoryForm";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { StepBack } from "lucide-react";
import { useDispatch } from "react-redux";
import { addCategory } from "@/Redux/categoriesSlice";


const AddCategory = () => {
    const [loading, setLoading] = useState(false);
    const { uploadImageToServer } = useUploadImage();
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function handleSubmit(formData, setFormData) {
        try {
            setLoading(true);
            const uploadedImage = await uploadImageToServer(formData.image);

            const payload = {
                name: formData.name,
                description: formData.description,
                image: uploadedImage,
                attributes: formData.attributes
            };
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/admin/add-category`,
                payload,
                {
                    withCredentials: true,
                }
            );
            dispatch(addCategory(response?.data?.category))
            setFormData({ name: "", description: "", image: null, attributes: [] });
            navigate("/admin/category")
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-5">
                <h1 className="text-2xl font-bold text-gray-800">Add Category</h1>
                <Button variant="outline" className="pointer" onClick={() => navigate("/admin/category")} ><StepBack></StepBack>Back</Button>
            </div>


            <div className="mt-10">
                <CategoryForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
};


export default AddCategory