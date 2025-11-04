import { useState } from 'react'
import { Button } from '@/components/ui/button'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import ProductForm from './ProductForm';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '@/Redux/sellerSlice';
import useUploadImages from '@/Custom Hooks/useUploadImages';
import { StepBack } from 'lucide-react';

const EditProduct = () => {

    const [loading, setLoading] = useState(false)
    const { product } = useSelector((store) => store.product)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { id } = useParams()

    const { uploadImagesToServer } = useUploadImages()

    async function handleSubmit(formData, setFormData, productImages, setProductImages) {
        try {
            setLoading(true)

            let uploadedImages = []
            let imagesToUpload = productImages?.filter((i) => i instanceof File)
            let existingImages = productImages?.filter((i) => i.url)

            if (imagesToUpload.length > 0) {
                const uploaded = await uploadImagesToServer(imagesToUpload)
                uploadedImages = [...uploaded, ...existingImages]
            } else {
                uploadedImages = existingImages
            }

            const productData = {
                name: formData.name,
                price: Number(formData.price),
                brand: formData.brand,
                category: formData.category,
                stock: Number(formData.stock),
                highlights: formData.highlights,
                description: formData.description,
                attributes: formData.attributes,
                images: uploadedImages,
            };

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/edit/product/${id}`, productData, {
                withCredentials: true,
            });

            const data = response.data
            dispatch(updateProduct({ id, product: data.product }))
            console.log(data);

            setFormData({ name: "", price: "", salePrice: "", brand: "", category: "", stock: "", description: "", });
            setProductImages([])
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
                    <StepBack></StepBack> Back
                </Button>
            </div>

            <div className="bg-white p-6 rounded shadow-md">
                <ProductForm initialData={product} onSubmit={handleSubmit} loading={loading} />
            </div>
        </div>
    )
}



export default EditProduct




//new product add karke images wdit karke dekhna hai aur uske bad images[0] wala issue solve karna hai 