import AdminSidebar from "@/Main Components/Admin/AdminSidebar"
import { Outlet } from "react-router-dom"
const AdminLayout = () => {
    return (
        <div>
            <div>
                <AdminSidebar></AdminSidebar>
            </div>
            <div>
                <Outlet></Outlet>
            </div>
        </div>
    )
}

export default AdminLayout
