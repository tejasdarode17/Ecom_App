import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { formatDate } from "@/utils/formatDate";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { setSellerOrders, setSellerSingleOrder } from "@/Redux/sellerSlice";

export default function SellerOrders() {
    const dispatch = useDispatch();
    const { orders } = useSelector((store) => store.seller);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");


    async function fetchAllOrders() {
        try {
            setLoading(true);
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/seller/all-orders`,
                { withCredentials: true }
            );
            dispatch(setSellerOrders(res.data.orders));
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchAllOrders();
    }, []);

    function orderDetails(order) {
        dispatch(setSellerSingleOrder(order));
        navigate(`/seller/order/${order?._id}`);
    }

    // Filter orders based on search term
    const filteredOrders = orders.filter(order =>
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
                                <div className="flex justify-between">
                                    <div className="space-y-3">
                                        <div className="h-6 bg-slate-200 rounded w-48"></div>
                                        <div className="h-4 bg-slate-200 rounded w-32"></div>
                                        <div className="h-4 bg-slate-200 rounded w-24"></div>
                                    </div>
                                    <div className="h-12 bg-slate-200 rounded-2xl w-32"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-700 bg-clip-text text-transparent pb-2">
                        Order Management
                    </h1>
                    <p className="text-slate-600 mt-2">Manage and track your customer orders</p>
                </div>


                {/* Search and Filters */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <input
                            type="text"
                            placeholder="Search orders by ID, customer, or city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                            <svg className="w-12 h-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 text-lg font-medium">No orders found</p>
                        <p className="text-slate-400 text-sm mt-1">
                            {searchTerm ? "Try adjusting your search terms" : "Orders will appear here once customers start purchasing"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <Card
                                key={order._id}
                                className="
                                    p-6 border border-slate-200 
                                    shadow-sm hover:shadow-lg 
                                    rounded-2xl
                                    transition-all duration-300 
                                    bg-white/90 backdrop-blur-sm
                                    hover:border-blue-300
                                    cursor-pointer
                                    group
                                    hover:-translate-y-1
                                "
                                onClick={() => orderDetails(order)}
                            >
                                <div className="flex justify-between items-start gap-6">
                                    {/* LEFT SIDE */}
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center gap-3">
                                            <p className="font-bold text-slate-800 text-lg group-hover:text-blue-700 transition-colors">
                                                Order #{order._id.slice(-8).toUpperCase()}
                                            </p>
                                            <div className="flex gap-2">
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full font-semibold capitalize border ${order.paymentStatus === "paid"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-rose-50 text-rose-700 border-rose-200"
                                                        }`}
                                                >
                                                    Payment Status :  {order.paymentStatus}
                                                </span>
                                                {/* 
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full font-semibold capitalize border ${order.settlementStatus === "paid"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-amber-50 text-amber-700 border-amber-200"
                                                        }`}
                                                >
                                                    Payout : {order.settlementStatus}
                                                </span> */}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                            <div className="space-y-1">
                                                <p className="text-slate-500 text-xs font-medium">CUSTOMER</p>
                                                <p className="font-medium text-slate-800">
                                                    {order.customer?.username || "N/A"}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-slate-500 text-xs font-medium">ORDER DATE</p>
                                                <p className="font-medium text-slate-800">
                                                    {formatDate(order.createdAt)}
                                                </p>
                                            </div>

                                            <div className="space-y-1">
                                                <p className="text-slate-500 text-xs font-medium">SHIP TO</p>
                                                <p className="font-medium text-slate-800">
                                                    {order.address?.city}, {order.address?.state}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Shipping Status */}
                                        <div className="flex items-center gap-2 pt-2">
                                            <span className="text-slate-500 text-xs font-medium">STATUS:</span>
                                            <span
                                                className={`px-3 py-1.5 text-xs rounded-full font-semibold border ${order.shippingStatus === "shipped"
                                                    ? "bg-blue-50 text-blue-700 border-blue-200"
                                                    : order.shippingStatus === "delivered"
                                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                                        : "bg-slate-100 text-slate-700 border-slate-200"
                                                    }`}
                                            >
                                                {order.shippingStatus || "Ordered"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* RIGHT SIDE AMOUNT */}
                                    <div className="flex flex-col items-end min-w-[160px]">
                                        <p className="text-xs text-slate-500 tracking-wide font-medium mb-2">
                                            TOTAL AMOUNT
                                        </p>

                                        <div
                                            className="
                                                px-6 py-3
                                                rounded-2xl
                                                bg-gradient-to-r from-blue-500 to-blue-600
                                                text-white
                                                font-bold
                                                text-xl
                                                shadow-lg
                                                border border-blue-600
                                                group-hover:from-blue-600 group-hover:to-blue-700
                                                transition-all
                                            "
                                        >
                                            ₹{order?.sellerTotalAmount?.toLocaleString("en-IN")}
                                        </div>
                                        {/* 
                                        {order.settlementStatus === "paid" ? (
                                            <div className="flex items-center gap-1 mt-3 text-emerald-600">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-semibold">Settled</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1 mt-3 text-amber-600">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-xs font-semibold">Pending Payout</span>
                                            </div>
                                        )} */}
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


