import { useSelector } from "react-redux";

const SellerDashboard = () => {
    const { products, orders, revenue } = useSelector((store) => store.seller);
    const { recentOrders, recentOrdersLoading } = orders;
    const { statsLoading, totalRevenue, todayRevenue, monthlyRevenue } = revenue;
    const { userData } = useSelector((store) => store.auth);


    return (
        <div className="space-y-10">

            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    Welcome, {userData?.username} 👋
                </h1>
                <p className="text-gray-600 mt-1">
                    Here's an overview of your store performance.
                </p>
            </div>

            {/* Account Warning */}
            {userData?.status !== "approved" && (
                <div className="border border-yellow-400 bg-yellow-50 px-4 py-3 rounded-xl">
                    <p className="font-semibold text-yellow-800">
                        Your account status: {userData?.status?.toUpperCase()}
                    </p>
                    <p className="text-sm text-yellow-700">
                        Some features may be limited until approval.
                    </p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

                {/* Total Products */}
                <div className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition">
                    <h2 className="text-sm font-medium text-gray-500">Products</h2>
                    <p className="text-4xl font-bold text-blue-600 mt-2">
                        {products?.totalProducts}
                    </p>
                </div>

                {/* Total Orders */}
                <div className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition">
                    <h2 className="text-sm font-medium text-gray-500">Total Orders</h2>
                    <p className="text-4xl font-bold text-green-600 mt-2">
                        {orders?.totalOrders || 0}
                    </p>
                </div>

                {/* Today's Revenue */}
                <div className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition">
                    <h2 className="text-sm font-medium text-gray-500">Today's Revenue</h2>
                    {statsLoading ? (
                        <p className="text-gray-400 mt-2 animate-pulse">Loading…</p>
                    ) : (
                        <p className="text-4xl font-bold text-indigo-600 mt-2">₹{todayRevenue}</p>
                    )}
                </div>

                {/* Monthly Revenue */}
                <div className="bg-white shadow-sm border rounded-xl p-6 hover:shadow-md transition">
                    <h2 className="text-sm font-medium text-gray-500">This Month</h2>
                    {statsLoading ? (
                        <p className="text-gray-400 mt-2 animate-pulse">Loading…</p>
                    ) : (
                        <p className="text-4xl font-bold text-purple-600 mt-2">₹{monthlyRevenue}</p>
                    )}
                </div>
            </div>

            {/* Lifetime Revenue Card */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-6 shadow-md">
                <h2 className="text-lg font-semibold tracking-wide">Lifetime Revenue</h2>
                {statsLoading ? (
                    <p className="text-white/70 mt-2 animate-pulse">Loading…</p>
                ) : (
                    <p className="text-5xl font-bold mt-3">₹{totalRevenue}</p>
                )}
            </div>

            {/* Recent Orders */}
            <div className="bg-white shadow-sm border rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                </div>

                {/* Loading */}
                {recentOrdersLoading && (
                    <div className="py-6 text-center text-gray-500">
                        Loading recent orders...
                    </div>
                )}

                {/* Empty */}
                {!recentOrdersLoading && recentOrders.length === 0 && (
                    <div className="py-6 text-center text-gray-500">
                        No recent orders.
                    </div>
                )}

                {/* Table */}
                {!recentOrdersLoading && recentOrders.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border-separate border-spacing-y-2">
                            <thead className="text-gray-600 text-sm">
                                <tr>
                                    <th className="py-2 px-4 text-left">Order</th>
                                    <th className="py-2 px-4 text-left">Items</th>
                                    <th className="py-2 px-4 text-left">Revenue</th>
                                    <th className="py-2 px-4 text-left">Payment</th>
                                    <th className="py-2 px-4 text-left">Delivery</th>
                                    <th className="py-2 px-4 text-left">Date</th>
                                </tr>
                            </thead>

                            <tbody className="text-sm text-gray-800">
                                {recentOrders.map((order) => (
                                    <tr
                                        key={order._id}
                                        className="bg-gray-50 hover:bg-gray-100 transition rounded-lg"
                                    >
                                        <td className="py-3 px-4 font-medium">
                                            #{order._id.slice(-6)}
                                        </td>
                                        <td className="py-3 px-4">
                                            {order.items.length} item(s)
                                        </td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                            ₹{order.sellerTotalAmount}
                                        </td>
                                        <td className="py-3 px-4 capitalize">
                                            {order.paymentStatus}
                                        </td>
                                        <td className="py-3 px-4 capitalize">
                                            {order.items[0]?.deliveryStatus || "-"}
                                        </td>
                                        <td className="py-3 px-4">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerDashboard;
