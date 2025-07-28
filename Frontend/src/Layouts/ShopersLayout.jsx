import Navbar from "@/Main Components/Shopers/Navbar"
import { Outlet } from "react-router-dom"

const ShopersLayout = () => {
    return (
        <div>
            <div>
                <Navbar></Navbar>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default ShopersLayout
