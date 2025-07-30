const SellerDashboard = () => {
    return (
        <div className="space-y-8">
            {/* Heading */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800">Welcome, Seller 👋</h1>
                <p className="text-gray-600 mt-1">Here’s your business overview for today.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Total Products</h2>
                    <p className="text-3xl font-bold text-blue-600 mt-2">128</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Orders Today</h2>
                    <p className="text-3xl font-bold text-green-600 mt-2">34</p>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-700">Revenue</h2>
                    <p className="text-3xl font-bold text-purple-600 mt-2">₹12,540</p>
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
