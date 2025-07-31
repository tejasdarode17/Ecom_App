import { NavLink } from "react-router-dom";
import { FaBoxOpen, FaChartLine, FaClipboardList, FaCog } from "react-icons/fa";

const SellerSidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-900 text-white flex flex-col">
            <div className="px-6 py-4 text-2xl font-bold border-b border-gray-700">
                Seller Panel
            </div>

            <nav className="flex-1 px-4 py-6 space-y-4">
                <NavLink
                    to="/seller/home/dashboard"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <FaChartLine /> Dashboard
                </NavLink>

                <NavLink
                    to="/seller/products"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <FaBoxOpen /> Products
                </NavLink>

                <NavLink
                    to="/seller/orders"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <FaClipboardList /> Orders
                </NavLink>

                <NavLink
                    to="/seller/settings"
                    className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2 rounded hover:bg-gray-800 ${isActive ? "bg-gray-800" : ""
                        }`
                    }
                >
                    <FaCog /> Settings
                </NavLink>
            </nav>
        </div>
    );
};

export default SellerSidebar;
