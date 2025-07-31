import { Link } from "react-router-dom";
import { useState } from "react";

const Login = () => {

  const [userInput, setUserInput] = useState({
    email: "",
    password: "",
  })

  //login karna hai 
  //registration ho gaya hai seller ka aur userr ka 
  //logim karna hai aur route protected karna hai 


  return (
    <div className="bg-white shadow-md rounded px-8 py-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>

      <form className="space-y-4">
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
          Login
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don't have an account?{" "}
        <Link to="/user/register" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>

      {/* 🔘 Seller login button */}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 mb-2">Are you a seller?</p>
        <Link
          to="/seller/login"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded"
        >
          Login as Seller
        </Link>
      </div>
    </div>
  );
};

export default Login;
