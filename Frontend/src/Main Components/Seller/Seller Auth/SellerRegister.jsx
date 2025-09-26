import { setUser } from "@/Redux/authSlice";
import axios from "axios";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";


const SellerRegister = () => {

    const [sellerInput, setSellerInput] = useState({ name: "", email: "", address: "", password: "" })

    const dispatch = useDispatch()


    async function handleSellerRegistration(e) {
        try {

            e.preventDefault()
            sellerInput.email.toLowerCase()

            if (!sellerInput.name || !sellerInput.email || !sellerInput.password || !sellerInput.address) {
                toast.error("Please fill all the feilds")
            }

            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/seller/register`, sellerInput, {
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
        <div className="bg-white shadow-md rounded px-8 py-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Seller Registration</h2>

            <form className="space-y-4"
                onSubmit={(e) => handleSellerRegistration(e)}
            >
                <div>
                    <label htmlFor="name" className="block text-gray-700 mb-1">Full Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => { setSellerInput((prev) => ({ ...prev, name: e.target.value })) }}
                    />
                </div>

                <div>
                    <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seller@example.com"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => { setSellerInput((prev) => ({ ...prev, email: e.target.value })) }}

                    />
                </div>

                <div>
                    <label htmlFor="address" className="block text-gray-700 mb-1">Business Address</label>
                    <textarea
                        id="address"
                        name="address"
                        placeholder="Shop #123, Market Road, City"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => { setSellerInput((prev) => ({ ...prev, address: e.target.value })) }}

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
                        onChange={(e) => { setSellerInput((prev) => ({ ...prev, password: e.target.value })) }}

                    />
                </div>


                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Register as Seller
                </button>
            </form >

            <p className="text-center text-sm text-gray-600 mt-4">
                Already a seller?{" "}
                <Link to="/seller/auth/login" className="text-green-600 hover:underline">
                    Login here
                </Link>
            </p>
        </div >
    );
};

export default SellerRegister;
