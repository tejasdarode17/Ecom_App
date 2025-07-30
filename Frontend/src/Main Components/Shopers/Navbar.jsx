import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

function Navbar() {

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
          <Link to="/auth" className="hover:text-indigo-600">Login</Link>

          {/* Cart */}
          <Link to="/cart" className="relative flex items-center hover:text-indigo-600">
            <ShoppingCart size={22} />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
