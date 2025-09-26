import { Input } from "@/components/ui/input"
import { useDispatch, useSelector } from "react-redux"
import SellersTable from "./SellersTable";
import { useEffect, useState } from "react";
import { fetchAllSellers } from "@/Redux/adminSlice";

const AdminSellers = () => {

    const [status, setStatus] = useState("all")
    const { sellersByStatus } = useSelector((store) => store.admin)
    const dispatch = useDispatch()

    const sellers = sellersByStatus?.[status]?.data || []

    const page = 1
    const limit = 20

    useEffect(() => {
        dispatch(fetchAllSellers({ status, page, limit }));
    }, [status]);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Sellers</h1>
                <div className="flex gap-2">
                    <Input placeholder="Search sellers..." className="w-64" />
                    <select
                        className="border rounded-lg px-3 py-2"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="all">All</option>
                        <option value="pending">Pending</option>
                        <option value="suspend">Suspended</option>
                        <option value="banned" >Banned</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Sellers Table */}
            <SellersTable sellers={sellers} ></SellersTable>
        </div>
    );
}


export default AdminSellers

