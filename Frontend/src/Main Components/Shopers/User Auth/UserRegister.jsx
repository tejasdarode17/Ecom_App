import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { setUser } from "@/Redux/authSlice";

const Register = () => {
  const [userInput, setUserInput] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const dispatch = useDispatch();

  async function handleRegister(e) {
    try {
      e.preventDefault();
      setIsLoading(true);

      if (!userInput.name || !userInput.email || !userInput.password) {
        setErrors("Please fill all fields");
        return toast.error("Check your input");
      }

      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/register`,
        userInput,
        { withCredentials: true }
      );

      dispatch(setUser(response.data.user));
    } catch (error) {
      setErrors(error?.response?.data?.message || error.message);
      toast.error(error.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl px-8 py-10 transition-all duration-300 hover:shadow-2xl">

      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-green-600">📝</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h2>
        <p className="text-gray-600">Join our platform today</p>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleRegister}>

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 focus:border-green-500 focus:ring-green-200"
            value={userInput.name}
            onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 focus:border-green-500 focus:ring-green-200"
            value={userInput.email}
            onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 focus:border-green-500 focus:ring-green-200"
            value={userInput.password}
            onChange={(e) => setUserInput({ ...userInput, password: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              Creating...
            </>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>

      {/* Error message at bottom */}
      {errors && (
        <p className="mt-4 text-red-600 text-sm text-center flex items-center justify-center">
          <span className="mr-1">❌</span>
          {errors}
        </p>
      )}

      {/* Sign In */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Already have an account?{" "}
        <Link
          to="/user/auth/login"
          className="text-green-600 hover:text-green-500 font-semibold transition-colors duration-200"
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default Register;
