import { Outlet } from "react-router-dom";

const SellerAuthLayout = () => {
    return (
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

            <div className="bg-green-700 text-white p-10 flex flex-col justify-center items-start">
                <h1 className="text-4xl font-bold mb-4">Shoply Sellers</h1>
                <p className="text-lg">
                    Grow your business with Shoply. Manage products, track orders, and connect with buyers — all in one place.
                </p>
                <ul className="mt-6 space-y-2 list-disc list-inside text-sm">
                    <li>🛍️ Easy product listing and inventory control</li>
                    <li>📦 Real-time order tracking & management</li>
                    <li>📈 AI-powered sales insights and suggestions</li>
                </ul>
            </div>

            {/* Right - Form Area */}
            <div className="p-10 flex justify-center items-center">
                <div className="w-full max-w-md">
                    <Outlet />
                </div>
            </div>

        </div>
    );
};

export default SellerAuthLayout;
