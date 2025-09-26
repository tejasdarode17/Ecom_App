import { Button } from '@/components/ui/button'
import { setSingleProduct } from '@/Redux/productsSlice'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const SellerSingleProduct = () => {

    const { product } = useSelector((store) => store.product)
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    async function getSingleProduct() {

        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/product/${id}`, {
                withCredentials: true,
            });
            const data = response.data
            console.log(data);
            dispatch(setSingleProduct(data?.product))
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getSingleProduct()
    }, [id])


    return (
        <div className="p-6">

            <div className="flex justify-between items-center mb-6">
                <h1 className='text-2xl pl-7'>{product.brand}</h1>
                <Button onClick={() => navigate('/seller/products')} variant="outline">
                    Back to Products
                </Button>
            </div>



            <div className="flex gap-6">
                {/* Product Image */}
                <div className="w-1/3">
                    <img src={product?.image?.url} className="rounded-lg border" />
                </div>

                {/* Product Info */}
                <div className="w-2/3 space-y-4">
                    <h1 className="text-2xl font-bold">{product?.name}</h1>
                    <p className="text-gray-600">{product?.category?.name}</p>
                    <p className="text-lg font-semibold">₹{product?.price}</p>
                    <p>Stock: <span className="font-medium">{product?.stock}</span></p>
                    {/* <span className={`px-3 py-1 rounded text-white ${product?.status === "Low Stock" ? "bg-yellow-500" : "bg-green-500"}`}>
                        {product?.status}
                    </span> */}

                    <div className="flex gap-4 mt-4">
                        <Button variant="outline" onClick={() => navigate(`/seller/edit-product/${product._id}`)} className="w-25">Edit</Button>
                        <Button variant="outline" className="w-25">Put in Sale</Button>
                    </div>
                </div>
            </div>

            {/* Product Details Section */}
            <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4">Product Details</h2>
                <p>{product?.description || "No description available."}</p>
            </div>
        </div>

    )
}

export default SellerSingleProduct