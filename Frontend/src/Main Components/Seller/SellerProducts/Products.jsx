import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import { format } from "date-fns";
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Power } from "lucide-react";



const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate()



    async function getAllProducts() {
        try {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/products`, {
                withCredentials: true,
            });
            const data = response.data
            console.log(data);
            setProducts(data?.products)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [])



    return (
        <div className="w-full p-6 min-h-screen">

            <div>
                <ProductsHeaderButtons></ProductsHeaderButtons>
            </div>

            <div>
                <SearchAndFilter></SearchAndFilter>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-6 font-semibold text-sm text-gray-500 bg-gray-100 px-6 py-3">
                    <span className="text-left">Product Name</span>
                    <span className="text-left">Category</span>
                    <span className="text-left">Stock</span>
                    <span className="text-left">Price</span>
                    <span className="text-left">Status</span>
                    <span className="text-center">Action</span>
                </div>

                {/* Scrollable Body */}
                <ScrollArea className="h-[600px]">
                    {products.map((product) => {
                        return (
                            <div
                                key={product._id}
                                className="grid grid-cols-6 items-center text-sm px-6 py-4 border-b hover:bg-gray-50"
                            >
                                {/* Product Name (Image + Text) */}
                                <div className="flex items-center gap-3 min-w-[180px]">
                                    <img
                                        src={product?.image?.url}
                                        alt={product?.name}
                                        className="h-10 w-10 rounded object-cover"
                                    />
                                    <span className="font-medium">{product?.name}</span>
                                </div>

                                {/* Category */}
                                <span className="text-gray-600">{product?.category}</span>

                                {/* Stock */}
                                <span
                                    className={
                                        product.stock === 0
                                            ? "text-red-500 font-medium"
                                            : product.stock <= 10
                                                ? "text-yellow-500 font-medium"
                                                : "text-green-600 font-medium"
                                    }
                                >
                                    {product.stock}
                                </span>

                                {/* Price */}
                                <span className="text-gray-800 font-semibold">₹{product.price}</span>

                                {/* Status */}
                                <span>
                                    {product.stock === 0 ? (
                                        <Badge className="bg-red-100 text-red-700">Stock Out</Badge>
                                    ) : product.stock <= 10 ? (
                                        <Badge className="bg-yellow-100 text-yellow-700">Low Stock</Badge>
                                    ) : (
                                        <Badge className="bg-green-100 text-green-700">Published</Badge>
                                    )}
                                </span>

                                {/* Action Button */}
                                <div className="text-center cursor-pointer text-gray-600 hover:text-black">
                                    <ActionButton product={product} />
                                </div>
                            </div>
                        );
                    })}
                </ScrollArea>

                {/* Footer Pagination */}
                <>
                    <ProductsFooter products={products} ></ProductsFooter>
                </>

            </div>
        </div>
    );
};




const SearchAndFilter = () => {



    return (

        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <Input placeholder="Search by product name..." className="sm:max-w-sm" />
            <div className="flex gap-2 flex-wrap">
                <Input
                    type="date"
                    defaultValue={format(new Date(), "yyyy-MM-dd")}
                    className="w-fit"
                />
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Status</option>
                    <option>Published</option>
                    <option>Inactive</option>
                    <option>Draft</option>
                </select>
                <select className="border border-gray-300 rounded px-3 py-2 text-sm">
                    <option>Category</option>
                    <option>Electronics</option>
                </select>
                <Button variant="outline">Filter</Button>
            </div>
        </div>


    )
}

const ProductsHeaderButtons = () => {
    return (
        <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl font-semibold text-gray-800">Products List</h1>

            <div className="flex gap-2">
                <Button variant="outline">Import</Button>
                <Button variant="outline">Export</Button>
                <Button onClick={() => navigate("/seller/add-product")} variant="outline">Add Product</Button>
            </div>
        </div>
    )
}

const ProductsFooter = ({ products }) => {
    return (
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50 text-sm text-gray-600">
            <span>
                Result 1-{products.length} of {products.length}
            </span>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                    Previous
                </Button>
                <Button variant="outline" size="sm">
                    1
                </Button>
                <Button variant="outline" size="sm">
                    Next
                </Button>
            </div>
        </div>
    )
}


const ActionButton = ({ product }) => {

    const navigate = useNavigate()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <FiMoreVertical size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48" align="end">
                <DropdownMenuLabel>Product Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Toggle Status */}
                <DropdownMenuItem className="justify-between" onSelect={(e) => e.preventDefault()} >
                    <span className="flex items-center space-x-2">
                        <Power size={16} />
                        <span>{product.active ? "Active" : "Inactive"}</span>
                    </span>
                    <Switch
                        checked={product.active}
                    // onCheckedChange={() => toggleProductStatus(product._id, !product.active)}
                    />
                </DropdownMenuItem>

                {/* Delete Option */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={() => handleDelete(product._id)}
                    className="text-red-600 hover:bg-red-50 cursor-pointer"
                >
                    <FiTrash2 size={16} className="mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default Products


