import { setUser } from "@/Redux/authSlice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SellerLogin = () => {

    const [sellerInput, setSellerInput] = useState({ name: "", email: "", address: "", password: "" })
    const dispatch = useDispatch()

    async function handleSellerLogin(e) {
        try {

            e.preventDefault()
            sellerInput.email.toLowerCase()

            if (!sellerInput.email || !sellerInput.password) {
                toast.error("Please fill all the feilds")
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/login`, sellerInput, {
                withCredentials: true
            })

            const data = response.data
            dispatch(setUser(data?.user))

        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message)
        }
    }



    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Seller Login</h2>

                <form className="space-y-4"
                    onSubmit={(e) => handleSellerLogin(e)}
                >
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seller@example.com"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => setSellerInput((prev) => ({ ...prev, email: e.target.value }))}
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            onChange={(e) => setSellerInput((prev) => ({ ...prev, password: e.target.value }))}

                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Login as Seller
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don't have a seller account?{" "}
                    <Link to="/seller/auth/register" className="text-green-600 hover:underline">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SellerLogin;
