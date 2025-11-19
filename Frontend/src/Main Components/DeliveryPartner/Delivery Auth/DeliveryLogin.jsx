import { Button } from "@/components/ui/button";
import { setUser } from "@/Redux/authSlice";
import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const DeliveryLogin = () => {

    const [input, setInput] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate()
    async function handleDeliveryPartnerLogin(e) {
        try {

            e.preventDefault();
            input.email = input.email.toLowerCase();
            if (!input.email || !input.password) {
                return toast.error("Please fill all the fields");
            }
            const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/delivery/login`,
                input,
                { withCredentials: true }
            );

            const data = response.data;
            dispatch(setUser(data?.user));

        } catch (error) {
            console.log(error);
            toast.error(
                error?.response?.data?.message ||
                "Something went wrong. Please try again later!"
            );
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="bg-white shadow-lg rounded px-8 py-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Delivery Partner Login
                </h2>

                <form
                    className="space-y-4"
                    onSubmit={handleDeliveryPartnerLogin}
                >
                    <div>
                        <label htmlFor="email" className="block text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="partner@example.com"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                                setInput((prev) => ({ ...prev, email: e.target.value }))
                            }
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) =>
                                setInput((prev) => ({ ...prev, password: e.target.value }))
                            }
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                    >
                        Login as Delivery Partner
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 mt-4">
                    Don’t have an account?{" "}
                    <Link to="/delivery/auth/register" className="text-blue-600 hover:underline">
                        Register here
                    </Link>
                </p>


                <div className="flex justify-center mt-5">
                    <Button variant="outline" onClick={() => navigate("/")}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryLogin;
