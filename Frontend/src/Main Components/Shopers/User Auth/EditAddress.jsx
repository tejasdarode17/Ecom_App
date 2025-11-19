import React, { useState } from 'react'
import AddressForm from './AddressForm'
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { editUserAddress } from '@/Redux/authSlice';
import { toast } from 'sonner';


const EditAddress = ({ open, setOpen, address }) => {

    const id = address?._id
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    async function handleEditAddress(deliveryAddress, setDeliveryAddress) {
        try {
            setLoading(true)
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/address/${id}`, deliveryAddress, {
                withCredentials: true,
            });
            console.log(response.data);
            dispatch(editUserAddress({ id, address: response?.data?.address }))
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
            <AddressForm onSubmit={handleEditAddress} loading={loading} open={open} setOpen={setOpen} initialData={address}></AddressForm>
        </div >
    )
}

export default EditAddress