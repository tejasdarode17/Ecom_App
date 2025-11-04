import React, { useState } from 'react'
import AddressForm from './AddressForm'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { updateUserAddresses } from '@/Redux/authSlice';
import { toast } from 'sonner';


const AddAddress = ({ open, setOpen }) => {

    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    async function handleAddAddress(deliveryAddress, setDeliveryAddress) {
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/address`, deliveryAddress, {
                withCredentials: true,
            });
            console.log(response.data);
            dispatch(updateUserAddresses(response?.data?.address))
            setOpen(false)
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Something Went Wrong on Server")
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>
            <AddressForm onSubmit={handleAddAddress} loading={loading} open={open} setOpen={setOpen}></AddressForm>
        </div >
    )
}

export default AddAddress