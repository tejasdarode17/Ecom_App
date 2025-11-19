import { setUser } from "@/Redux/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SellerRegister = () => {
    const [sellerInput, setSellerInput] = useState({
        name: "",
        email: "",
        address: "",
        password: ""
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function handleSellerRegistration(e) {
        e.preventDefault();

        try {
            if (
                !sellerInput.name ||
                !sellerInput.email ||
                !sellerInput.password ||
                !sellerInput.address
            ) {
                return toast.error("Please fill all the fields");
            }

            const response = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/seller/register`,
                sellerInput,
                { withCredentials: true }
            );

            dispatch(setUser(response.data?.user));
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Something went wrong, try again later!"
            );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center  px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transition-all duration-300">

                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 tracking-tight">
                    Seller Registration
                </h2>

                <form className="space-y-5" onSubmit={handleSellerRegistration}>
                    {/* Full Name */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                            Full Name
                        </label>
                        <input
                            id="name"
                            type="text"
                            placeholder="John Doe"
                            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) =>
                                setSellerInput(prev => ({ ...prev, name: e.target.value }))
                            }
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            placeholder="seller@example.com"
                            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) =>
                                setSellerInput(prev => ({ ...prev, email: e.target.value }))
                            }
                        />
                    </div>

                    {/* Address */}
                    <div>
                        <label htmlFor="address" className="block text-gray-700 font-medium mb-1">
                            Business Address
                        </label>
                        <textarea
                            id="address"
                            placeholder="Shop #123, Market Road, City"
                            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[90px]"
                            onChange={(e) =>
                                setSellerInput(prev => ({ ...prev, address: e.target.value }))
                            }
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border rounded-lg bg-gray-50 focus:bg-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) =>
                                setSellerInput(prev => ({ ...prev, password: e.target.value }))
                            }
                        />
                    </div>

                    {/* Register Button */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 transition-colors duration-200 text-white font-semibold py-3 rounded-lg shadow-sm"
                    >
                        Register as Seller
                    </button>
                </form>

                {/* Already have account? */}
                <p className="text-center text-sm text-gray-600 mt-5">
                    Already a seller?{" "}
                    <Link
                        to="/seller/auth/login"
                        className="text-green-600 font-medium hover:underline"
                    >
                        Login here
                    </Link>
                </p>

                {/* Back Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => navigate("/")}
                        className="text-gray-700 hover:text-gray-900 font-medium text-sm underline"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SellerRegister;
