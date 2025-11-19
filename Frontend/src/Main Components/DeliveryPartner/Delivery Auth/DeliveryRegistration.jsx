import { Button } from "@/components/ui/button";
import { setUser } from "@/Redux/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeliveryRegistration = () => {

    const [partnerInput, setPartnerInput] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        vehicle: "bike",
    });

    const dispatch = useDispatch();
    const navigate = useNavigate()

    async function handlePartnerRegistration(e) {
        e.preventDefault();
        const { name, email, password, } = partnerInput;
        if (!name || !email || !password) {
            toast.error("Please fill all the required fields");
            return;
        }
        try {
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delivery/register`,
                partnerInput,
                { withCredentials: true }
            );
            dispatch(setUser(response.data?.user));
        } catch (error) {
            console.log(error);
            toast.error(error?.response?.data?.message || "Registration failed");
        }
    }


    return (
        <div className="bg-white shadow-md rounded px-8 py-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                Delivery Partner Registration
            </h2>

            <form className="space-y-4" onSubmit={handlePartnerRegistration}>
                <div>
                    <label className="block text-gray-700 mb-1">Full Name</label>
                    <input
                        type="text"
                        placeholder="John Rider"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPartnerInput(prev => ({ ...prev, name: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        placeholder="rider@example.com"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPartnerInput(prev => ({ ...prev, email: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Phone (optional)</label>
                    <input
                        type="text"
                        placeholder="9876543210"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPartnerInput(prev => ({ ...prev, phone: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Password</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPartnerInput(prev => ({ ...prev, password: e.target.value }))}
                    />
                </div>

                <div>
                    <label className="block text-gray-700 mb-1">Vehicle Type</label>
                    <select
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={(e) => setPartnerInput(prev => ({ ...prev, vehicle: e.target.value }))}
                    >
                        <option value="bike">Bike</option>
                        <option value="miniTruck">Mini Truck</option>
                        <option value="truck">Truck</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                >
                    Register as Delivery Partner
                </button>
            </form>

            <div>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Already registered?{" "}
                    <Link to="/delivery/auth/login" className="text-blue-600 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>

            <div className="flex justify-center mt-5">
                <Button variant="outline" onClick={() => navigate("/")}>
                    Back to Home
                </Button>
            </div>
        </div>
    );
};

export default DeliveryRegistration;
