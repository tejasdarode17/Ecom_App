import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import React from 'react'

const SellerNavbar = () => {

    return (
        <div className=' flex justify-between'>
            <Button><Menu></Menu></Button>
            <Button>Logout</Button>
        </div>
    )
}

export default SellerNavbar
