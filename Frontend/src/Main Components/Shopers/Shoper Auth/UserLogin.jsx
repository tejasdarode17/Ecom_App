import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/Redux/authSlice";

const Login = () => {

  const [userInput, setUserInput] = useState({ email: "", password: "" })
  const { isAuthenticated, userData } = useSelector((store) => store.auth);

  const dispatch = useDispatch()
  const navigate = useNavigate()


  async function handleLogin(e) {
    try {
      e.preventDefault()

      if (!userInput.email || !userInput.password) {
        toast.error("Please Fill all the feilds")
      }

      userInput.email.toLowerCase()

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`, userInput, {
        withCredentials: true
      })
      const data = response.data
      dispatch(setUser(data.user))
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }



  return (
    <div className="bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

      <form className="space-y-4"
        onSubmit={(e) => handleLogin(e)}
      >
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserInput((prev) => ({ ...prev, email: e.target.value }))}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setUserInput((prev) => ({ ...prev, password: e.target.value }))}

          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <Link to="/user/auth/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>

      {/* 🔘 Seller login button */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Are you a seller?</p>
        <Link
          to="/seller/auth/login"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Login as Seller
        </Link>
      </div>
    </div>
  );
};

export default Login;
