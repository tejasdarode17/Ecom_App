import { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useDispatch, useSelector } from 'react-redux';
import useUploadImage from '@/Custom Hooks/useUploadImage';
import { updateProduct } from '@/Redux/sellerSlice';

const EditProduct = () => {

    const [loading, setLoading] = useState(false)
    const { product } = useSelector((store) => store.product)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

    const { uploadImageToServer } = useUploadImage()

    async function handleSubmit(formData, setFormData) {

        try {
            setLoading(true)

            //only upload if the image is file 
            let uploadedImage = formData.image;
            if (formData.image && formData.image instanceof File) {
                uploadedImage = await uploadImageToServer(formData.image);
            }

            const productData = {
                name: formData.name,
                price: Number(formData.price),
                brand: formData.brand,
                category: formData.category,
                stock: Number(formData.stock),
                description: formData.description,
                image: uploadedImage, //this is object 
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/edit/product/${id}`, productData, {
                withCredentials: true,
            });

            const data = response.data
            dispatch(updateProduct({ id, product: data.product }))
            console.log(data);

            setFormData({ name: "", price: "", salePrice: "", brand: "", category: "", stock: "", description: "", image: null, });
            navigate(`/seller/product/${id}`)
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="p-6 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Edit Product</h1>
                <Button onClick={() => navigate('/seller/products')} variant="outline">
                    Back
                </Button>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <ProductForm initialData={product} onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    )
}



export default EditProduct

