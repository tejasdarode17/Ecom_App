import { useState } from "react";
import { Link } from "react-router-dom";

const Register = () => {

  const [userInput, setUserInput] = useState({
    name: "",
    email: "",
    password: "",
  })


  return (
    <div className="bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Name</label>
          <input
            type="text"
            placeholder="Your name"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        <Link to="/auth" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>

      {/* 🔘 Seller Signup Option */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Want to sell on our platform?</p>
        <Link
          to="/seller/register"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Register as Seller
        </Link>
      </div>
    </div>
  );
};

export default Register;
