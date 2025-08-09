import SellerSidebar from '@/Main Components/Seller/SellerNavigations/SellerSideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const SellerLayout = () => {
    return (
        <div className="flex min-h-screen w-full">
            {/* Sidebar */}
            <div className="">
                <SellerSidebar />
            </div>

            {/* Outlet content */}
            <div className="flex-1 p-4 lg:p-10 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    )
}

export default SellerLayout
