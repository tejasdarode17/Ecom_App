import SellerNavbar from '@/Main Components/Seller/SellerNavigations/SellerNavbar'
import SellerSidebar from '@/Main Components/Seller/SellerNavigations/SellerSideBar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const SellerLayout = () => {
    return (
        <div className='w-full flex'>
            <div className='fixed'>
                <SellerSidebar></SellerSidebar>
            </div>
            <div className='lg:absolute lg:left-[15%] pl-10 pt-10' >
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default SellerLayout
