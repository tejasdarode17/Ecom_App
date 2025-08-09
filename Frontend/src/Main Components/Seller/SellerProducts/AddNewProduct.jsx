import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import ProductForm from './ProductForm'



export const AddNewProduct = () => {

    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)


    //this function returns a object which contain the imageURL and imageID we will call this function inside the onSubmit 
    async function uploadImageToServer(file) {
        const formData = new FormData();
        formData.append("image", file);
        // "image" must match multer.single("image") in backend route
        try {
            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/upload-image`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return response.data.image; //response contains {image: {url, public_id} }
        } catch (error) {
            console.error("Upload failed:", error);
            throw error;
        }
    }


    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true)
            const uploadedImage = await uploadImageToServer(formData.image);
            console.log(uploadedImage);
            const productData = {
                name: formData.name,
                price: Number(formData.price),
                salePrice: Number(formData.salePrice),
                brand: formData.brand,
                category: formData.category,
                stock: Number(formData.stock),
                description: formData.description,
                image: uploadedImage, //this is object 
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/add-product`, productData, {
                withCredentials: true,
            });

            const data = response.data
            setFormData({ name: "", price: "", salePrice: "", brand: "", category: "", stock: "", description: "", image: null, });
            navigate("/seller/products")
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Add New Product</h1>
                <Button onClick={() => navigate('/seller/products')} variant="outline">
                    Back
                </Button>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <ProductForm onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    );
}