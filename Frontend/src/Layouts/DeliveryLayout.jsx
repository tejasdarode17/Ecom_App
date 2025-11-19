import DeliveryPartnerSidebar from '@/Main Components/DeliveryPartner/DeliverySidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const DeliveryLayout = () => {
    return (
        <div className="flex min-h-screen w-full">
            <div className="">
                <DeliveryPartnerSidebar></DeliveryPartnerSidebar>
            </div>
            <div className="flex-1 p-4 lg:p-10 overflow-x-hidden">
                <Outlet />
            </div>
        </div>
    )
}

export default DeliveryLayout