import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";
import axios from 'axios';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Power } from "lucide-react";
import { toast } from 'sonner';
import { useDispatch, } from 'react-redux';
import { deleteProduct, updateProductStatus } from '@/Redux/sellerSlice';

const ProductsActionButton = ({ product }) => {

    const [isActive, setIsActive] = useState(product.active)
    const dispatch = useDispatch()

    async function toggleProductStatus(id, newStatus) {
        setIsActive(newStatus);
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/active/product/${id}`, { newStatus }, {
                withCredentials: true,
            });
            const data = response.data
            console.log(data);
            dispatch(updateProductStatus({ id, active: data.status }));
        } catch (err) {
            setIsActive(!newStatus)
            toast.error("Failed to update product status");
            console.error(err);
        }
    }

    async function handleDeleteProduct(id) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/delete/product/${id}`, {}, {
                withCredentials: true,
            });
            const data = response.data
            console.log(data);
            dispatch(deleteProduct(id))
        } catch (err) {
            toast.error("Failed to Delete Product");
            console.error(err);
        }
    }


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
                <DropdownMenuItem
                    className="justify-between"
                    onClick={(e) => e.preventDefault()}
                >
                    <span className="flex items-center space-x-2">
                        <Power size={16} />
                        <span>{isActive ? "Active" : "Inactive"}</span>
                    </span>
                    <Switch
                        checked={isActive}
                        onClick={(e) => e.stopPropagation()}
                        onCheckedChange={() => toggleProductStatus(product._id, !isActive)}
                    />
                </DropdownMenuItem>

                {/* Delete Option */}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={(e) => { e.preventDefault(), e.stopPropagation(), handleDeleteProduct(product._id) }}
                    className="text-red-600 hover:bg-red-50 cursor-pointer"
                >
                    <FiTrash2 size={16} className="mr-2" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}


export default ProductsActionButton