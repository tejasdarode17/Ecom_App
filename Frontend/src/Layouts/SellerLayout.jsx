import SellerSidebar from '@/Main Components/Seller/Seller Navigations/SellerSideBar'
import { fetchAllSellerProducts } from '@/Redux/sellerSlice'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet } from 'react-router-dom'

const SellerLayout = () => {

    const { isAuthenticated, userData } = useSelector((store) => store.auth);
    const dispatch = useDispatch();
    const { role } = userData


    useEffect(() => {
        if (isAuthenticated && role === "seller") {
            dispatch(fetchAllSellerProducts());
        }
    }, [isAuthenticated]);



    return (
        <div className="flex min-h-screen w-full">
            <div className="">
                <SellerSidebar />
            </div>
            <div className="flex-1 p-4 lg:p-10 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    )
}

export default SellerLayout
