import React from "react";
import { Package, MapPin, CheckCircle, Clock, LogOut, Menu } from "lucide-react";

const DeliveryDashboard = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex">

            <div className="flex-1 p-6">

                {/* Mobile Topbar */}
                <div className="md:hidden flex justify-between items-center mb-6">
                    <button>
                        <Menu size={26} />
                    </button>
                    <h2 className="text-lg font-bold">Delivery Dashboard</h2>
                </div>

                {/* Greeting */}
                <h1 className="text-3xl font-bold mb-4">Welcome, Delivery Partner 👋</h1>
                <p className="text-gray-600 mb-6">Here’s your current delivery overview.</p>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-4">
                            <Clock className="text-blue-500" size={30} />
                            <div>
                                <p className="text-gray-600 text-sm">Active Deliveries</p>
                                <h3 className="text-xl font-bold">3</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-4">
                            <CheckCircle className="text-green-500" size={30} />
                            <div>
                                <p className="text-gray-600 text-sm">Completed Today</p>
                                <h3 className="text-xl font-bold">8</h3>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-5 rounded-xl shadow-sm border">
                        <div className="flex items-center gap-4">
                            <Package className="text-orange-500" size={30} />
                            <div>
                                <p className="text-gray-600 text-sm">Total Earnings</p>
                                <h3 className="text-xl font-bold">₹450</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Orders Table */}
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                    <h2 className="text-xl font-semibold mb-4">Active Orders</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left text-gray-700">
                                    <th className="p-3">Order ID</th>
                                    <th className="p-3">Restaurant</th>
                                    <th className="p-3">Customer</th>
                                    <th className="p-3">Location</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>

                            <tbody>
                                {[1, 2, 3].map((order) => (
                                    <tr key={order} className="border-t hover:bg-gray-50">
                                        <td className="p-3">#DLV00{order}</td>
                                        <td className="p-3">Pizza Hub</td>
                                        <td className="p-3">Rahul Verma</td>
                                        <td className="p-3 flex items-center gap-1">
                                            <MapPin size={16} className="text-red-500" /> 4.2 km
                                        </td>
                                        <td className="p-3">
                                            <span className="bg-yellow-200 text-yellow-800 px-2 py-1 rounded text-xs">
                                                Picking Up
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default DeliveryDashboard;
