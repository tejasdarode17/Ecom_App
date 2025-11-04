import Footer from "@/Main Components/Shopers/Footer"
import Navbar from "@/Main Components/Shopers/Navigations/Navbar"
import { Outlet, useLocation } from "react-router-dom"

const ShopersLayout = () => {

    const location = useLocation()
    const path = location.pathname


    return (
        <div className="bg-[#F1F3F6]">
            <Navbar></Navbar>
            <Outlet></Outlet>
            {!path.startsWith("/cart") && < Footer ></Footer>}
        </div >
    )
}

export default ShopersLayout
