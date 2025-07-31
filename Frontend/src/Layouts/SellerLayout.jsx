import SellerSidebar from '@/Main Components/Seller/SellerSideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const SellerLayout = () => {
    return (
        <div className='flex'>
            <div>
                <SellerSidebar></SellerSidebar>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default SellerLayout
