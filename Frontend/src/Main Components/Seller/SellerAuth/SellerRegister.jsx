import { Link } from "react-router-dom";

const SellerRegister = () => {
    return (
        <div className="bg-white shadow-md rounded px-8 py-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Seller Registration</h2>

            <form className="space-y-4">
                <div>
                    <label className="block text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="seller@example.com"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Store Name</label>
                    <input
                        type="text"
                        placeholder="My Online Store"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Business Address</label>
                    <textarea
                        placeholder="Shop #123, Market Road, City"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Register as Seller
                </button>
            </form>

            <p className="text-center text-sm text-gray-600 mt-4">
                Already a seller?{" "}
                <Link to="/seller/login" className="text-green-600 hover:underline">
                    Login here
                </Link>
            </p>
        </div>
    );
};

export default SellerRegister;
