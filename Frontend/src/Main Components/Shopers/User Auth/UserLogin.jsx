import { Link } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/Redux/authSlice";

const Login = () => {
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const dispatch = useDispatch();

  async function handleLogin(e) {
    try {
      e.preventDefault();
      setIsLoading(true);
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/login`,
        userInput,
        { withCredentials: true }
      );

      dispatch(setUser(response.data.user));
    } catch (error) {
      setErrors(error?.response?.data?.message || "Something Went Wrong on server");
      toast.error(error?.response?.data?.message || "Something Went Wrong on server");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white shadow-xl rounded-2xl px-8 py-10 transition-all duration-300 hover:shadow-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl font-bold text-blue-600">🔐</span>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>

      {/* Form */}
      <form className="space-y-6" onSubmit={handleLogin}>
        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>

          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            value={userInput.email}
            onChange={(e) => setUserInput({ ...userInput, email: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <input
            id="password"
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200 border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            value={userInput.password}
            onChange={(e) => setUserInput({ ...userInput, password: e.target.value })}
            disabled={isLoading}
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      {/* Error at bottom */}
      {errors && (
        <p className="mt-4 text-red-600 text-sm text-center flex items-center justify-center">
          <span className="mr-1">❌</span>
          {errors}
        </p>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center">
        <div className="flex-1 border-t border-gray-300"></div>
        <div className="px-3 text-sm text-gray-600">Or continue with</div>
        <div className="flex-1 border-t border-gray-300"></div>
      </div>

      {/* Google */}
      <button
        type="button"
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        disabled={isLoading}
      >
        <span className="mr-2"></span>
        Continue with Google
      </button>

      {/* Sign Up */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Don't have an account?{" "}
        <Link
          to="/user/auth/register"
          className="text-blue-600 hover:text-blue-500 font-semibold transition-colors duration-200"
        >
          Sign up now
        </Link>
      </p>

      {/* Role Login */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Are you a seller?</p>
            <Link
              to="/seller/auth/login"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Seller Login
            </Link>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Delivery Partner?</p>
            <Link
              to="/delivery/auth/login"
              className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Delivery Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
