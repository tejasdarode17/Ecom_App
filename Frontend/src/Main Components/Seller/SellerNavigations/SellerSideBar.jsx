import { useLocation, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaClipboardList } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { clearUser } from "@/Redux/authSlice";
import { useDispatch } from "react-redux";
import { ChartNoAxesCombined, LayoutDashboard, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

const SellerSidebar = () => {

    const [openSheet, setOpenSheet] = useState(false)
    const navigate = useNavigate()
    
    return (
        <div>
            <div className="hidden lg:flex flex-col w-64 h-screen bg-gray-900 text-white">
                <div onClick={() => navigate("/seller")} className="flex gap-2 pointer items-center px-6 py-4 text-2xl font-bold border-b border-gray-700">
                    <ChartNoAxesCombined />
                    Admin Panel
                </div>
                <SideBarMenu></SideBarMenu>
            </div>

            <div className="lg:hidden">
                <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                    <SheetTrigger asChild>
                        <Menu onClick={() => setOpenSheet(true)} />
                    </SheetTrigger>
                    <SheetContent side="left" className="w-50">
                        <SheetHeader>
                            <SheetTitle onClick={() => navigate("/seller")} className='flex gap-2 items-center pointer mt-2'>
                                <ChartNoAxesCombined />
                                Admin Pannel
                            </SheetTitle>
                        </SheetHeader>
                        <SideBarMenu setOpenSheet={setOpenSheet}></SideBarMenu>
                    </SheetContent>
                </Sheet>
            </div>
        </div >
    );
};


const SideBarMenu = ({ setOpenSheet }) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()

    async function handleLogout() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, {
                withCredentials: true
            })
            const data = response.data
            dispatch(clearUser())
            navigate("/seller/auth/login")
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }

    const items = [
        {
            id: 1,
            name: "Dashboard",
            icon: <LayoutDashboard />,
            path: "/seller"
        },
        {
            id: 2,
            name: "Products",
            icon: <FaBoxOpen></FaBoxOpen>,
            path: "/seller/products"
        },
        {
            id: 3,
            name: "Orders",
            icon: <FaClipboardList></FaClipboardList>,
            path: "/seller/orders"
        },
        {
            id: 4,
            name: "Settings",
            icon: <Settings></Settings>,
            path: "/seller/settings"
        },
    ]

    return (
        <>
            {
                items.map((item) => (

                    <div className="flex w-full text-left lg:px-2 lg:py-2" key={item.id}>
                        <Button
                            onClick={() => {
                                navigate(item.path);
                                if (setOpenSheet) setOpenSheet(false)
                            }}
                            variant="ghost"
                            className={`w-full hover:bg-gray-500 ${location.pathname == item.path ? "bg-gray-500" : ""}`}>
                            {item.icon}
                            {item.name}
                        </Button>
                    </div >

                ))
            }
            <Button onClick={handleLogout} variant="ghost" className="bg-red-500 hover:bg-orange-600  lg:px-2 lg:py-2">
                Logout
            </Button>
        </>
    )
}

export default SellerSidebar;
