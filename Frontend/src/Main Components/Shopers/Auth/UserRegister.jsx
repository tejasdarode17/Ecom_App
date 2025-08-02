import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setUser } from "@/Redux/authSlice";


const Register = () => {

  const [userInput, setUserInput] = useState({ name: "", email: "", password: "" })
  const { isAuthenticated, userData } = useSelector((store) => store.auth);

  const dispatch = useDispatch()
  const navigate = useNavigate()


  async function handleRegister(e) {
    try {
      e.preventDefault()

      userInput.email.toLowerCase()


      if (!userInput.name || !userInput.email || !userInput.password) {
        toast("Something went wrong", {
          description: "Check your input",
          variant: "destructive",
        })
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`, userInput, {
        withCredentials: true
      })
      const data = response.data
      dispatch(setUser(data.user))
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }



  return (
    <div className="bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

      <form className="space-y-4"
        onSubmit={(e) => handleRegister(e)}
      >
        <div>
          <label htmlFor="name" className="block text-gray-700 mb-1">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => { setUserInput((prev) => ({ ...prev, name: e.target.value })) }}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => { setUserInput((prev) => ({ ...prev, email: e.target.value })) }}

          />
        </div>

        <div>
          <label htmlFor="password" className="block text-gray-700 mb-1">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => { setUserInput((prev) => ({ ...prev, password: e.target.value })) }}

          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <Link to="/user/auth/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>

      {/* 🔘 Seller Signup Option */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Want to sell on our platform?</p>
        <Link
          to="/seller/auth/register"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Register as Seller
        </Link>
      </div>
    </div>
  );
};

export default Register;



