import Footer from "@/Main Components/Shopers/Footer"
import Navbar from "@/Main Components/Shopers/Navbar"
import { Outlet } from "react-router-dom"

const ShopersLayout = () => {
    return (
        <div className="bg-[#ddd]">
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}

export default ShopersLayout
