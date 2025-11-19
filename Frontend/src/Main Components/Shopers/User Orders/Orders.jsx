import { fetchOrders, setOrder } from '@/Redux/userSlice';
import { formatDate } from '@/utils/formatDate';
import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import OrderStatusBadge from './OrderStatusBadge';
import { useNavigate } from 'react-router-dom';
import { Search } from "lucide-react";

const Orders = () => {

    const { orders } = useSelector((store) => store.user);
    const [filteredOrders, setFiltredOrders] = useState(orders)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [query, setQuery] = useState("");

    useEffect(() => {
        dispatch(fetchOrders());
    }, []);

    function orderDetails(order) {
        dispatch(setOrder(order));
        navigate(`/order/${order?._id}`);
    }

    useEffect(() => {
        const text = query.toLowerCase();
        const result = orders.filter(order => {
            return (
                order.items.some(item =>
                    item.product?.name?.toLowerCase().includes(text)
                )
            );
        });
        setFiltredOrders(result)
    }, [orders, query])



    return (
        <div className="min-h-screen py-5">

            <div className="flex justify-center mb-6">
                <div className="flex items-center bg-white shadow-md rounded px-5 py-2 w-[60%]">
                    <Search className="text-gray-500 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search yours orders here"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="ml-3 w-full outline-none text-sm"
                    />
                </div>
            </div>

            {filteredOrders.length === 0 && (
                <p className="text-center text-gray-500 mt-10">
                    No orders found 🫠
                </p>
            )}

            {filteredOrders.map((order) => (
                <div
                    onClick={() => orderDetails(order)}
                    key={order._id}
                    className="bg-white w-[60%] mx-auto shadow rounded-lg my-6 border overflow-hidden cursor-pointer hover:shadow-lg transition"
                >
                    {/* ---------- HEADER ---------- */}
                    <div className="bg-[#F7F9F9] px-6 py-3 flex justify-between items-center border-b">
                        <div className="flex gap-10 text-sm">
                            <div>
                                <p className="text-gray-600">ORDER PLACED</p>
                                <p className="font-semibold">
                                    {formatDate(order.createdAt)}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600">TOTAL</p>
                                <p className="font-semibold">
                                    {order.amount.toLocaleString("en-IN", {
                                        style: "currency",
                                        currency: "INR",
                                    })}
                                </p>
                            </div>

                            <div>
                                <p className="text-gray-600">PAYMENT</p>
                                <p className="font-semibold capitalize">
                                    {order.paymentMode}
                                </p>
                            </div>
                        </div>

                        <div className="text-sm">
                            <p className="text-gray-600">ORDER ID</p>
                            <p className="font-semibold">{order._id}</p>
                        </div>
                    </div>

                    {/* ---------- ORDER ITEMS ---------- */}
                    <div className="px-6 py-4 space-y-6">
                        {order.items.map((item) => (
                            <div
                                key={item._id}
                                className="flex justify-between items-start rounded-md p-4"
                            >
                                {/* LEFT SIDE */}
                                <div className="flex gap-4">
                                    <div className="w-24 h-24">
                                        <img
                                            src={item.product?.images?.[0]?.url}
                                            className="w-full h-full object-contain rounded"
                                            alt={item.product?.name}
                                        />
                                    </div>

                                    <div className="mt-1">
                                        <p className="font-semibold text-gray-800">
                                            {item.product?.name}
                                        </p>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Qty: {item.quantity} • Price: ₹{item.lockedPrice}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT SIDE */}
                                <div className="">
                                    <p className="text-gray-500 text-sm">ORDER STATUS</p>
                                    <div className='flex justify-center'>
                                        <OrderStatusBadge order={order} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Orders;
