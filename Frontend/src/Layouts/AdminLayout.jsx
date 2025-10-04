import AdminSidebar from "@/Main Components/Admin/Admin Navigation/AdminSidebar"
import { fetchAllSellers } from "@/Redux/adminSlice"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { Outlet } from "react-router-dom"
const AdminLayout = () => {

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(fetchAllSellers({ status: "all", page: 1, limit: 20 }));
        dispatch(fetchAllSellers({ status: "pending", page: 1, limit: 20 }));
    }, []);

    return (
        <div className="flex min-h-screen w-full">
            <div >
                <AdminSidebar></AdminSidebar>
            </div>
            <div className="flex-1 p-4 lg:p-10 overflow-x-hidden">
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default AdminLayout
