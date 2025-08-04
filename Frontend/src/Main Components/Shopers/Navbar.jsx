import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { clearUser } from "@/Redux/authSlice";

function Navbar() {

  const dispatch = useDispatch()


  async function handleLogout() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, {
        withCredentials: true
      })
      dispatch(clearUser())
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }


  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-indigo-600">
          Ecom
        </Link>

        {/* Links */}
        <div className="flex space-x-6 text-gray-700 font-medium">
          <Link to="/home" className="hover:text-indigo-600">Home</Link>
          <Link to="/products" className="hover:text-indigo-600">Products</Link>
          <Link to="/user/auth/login" className="hover:text-indigo-600">Login</Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center hover:text-indigo-600">
            <ShoppingCart size={22} />
          </Link>
          <Button variant="ghost" onClick={handleLogout}>Logout</Button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
