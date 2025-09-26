import { useSelector } from "react-redux";

const SellerDashboard = () => {

    const { products } = useSelector((store) => store.seller)
    const { userData } = useSelector((store) => store.auth)

    return (
        <div className="space-y-8">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, {userData?.username} 👋</h1>
                <p className="text-gray-600 mt-1">Here’s your business overview for today.</p>
            </div>


            {userData?.status !== "approved" && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg">
                    <p className="font-semibold">
                        Your account status: {userData?.status?.toUpperCase()}
                    </p>
                    {userData?.status === "pending" && (
                        <p className="text-sm">We’re reviewing your application. You’ll be notified once approved.</p>
                    )}
                    {userData?.status === "suspended" && (
                        <p className="text-sm">Your account is temporarily suspended. Please contact support.</p>
                    )}
                    {userData?.status === "banned" && (
                        <p className="text-sm text-red-600">Your account has been permanently banned.</p>
                    )}
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Total Products</h2>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{products?.length}</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Orders Today</h2>
                    <p className="text-3xl font-bold text-green-600 mt-2">0</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
                    <p className="text-3xl font-bold text-purple-600 mt-2">0</p>
                </div>
            </div>

            {/* Placeholder for charts or tables */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">Recent Orders</h2>
                <div className="text-sm text-gray-500">
                    {/* Replace this with table or chart later */}
                    You haven’t received any new orders today.
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;
