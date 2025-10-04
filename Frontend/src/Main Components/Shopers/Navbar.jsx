import { Link, useNavigate } from "react-router-dom";
import { Heart, ListOrdered, LogOut, Search, ShoppingCart, User } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "@/Redux/authSlice";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SearchBar from "./SearchBar";


function Navbar() {

  const { isAuthenticated } = useSelector((store) => store.auth);

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 py-5 flex justify-between items-center">
        <div className="flex items-center gap-6 w-1/2">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            Trenzzo
          </Link>

          {/* Search */}
          <SearchBar></SearchBar>

        </div>

        <div className="flex gap-6 text-gray-700 font-medium items-center">
          <Link to="/cart" className="relative flex items-center gap-2 hover:text-indigo-600">
            <ShoppingCart size={22} />
            <p>Cart</p>
          </Link>

          {isAuthenticated ? (
            <DropDownMenu></DropDownMenu>
          ) : (
            <Link to="/user/auth/login" className="hover:text-indigo-600">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}


const DropDownMenu = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userData } = useSelector((store) => store.auth);
  async function handleLogout() {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/user/logout`, {}, {
        withCredentials: true
      })
      dispatch(clearUser())
      navigate("/")
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center gap-2 hover:text-indigo-600 cursor-pointer">
          <User size={22} />
          <span>{userData?.username || "User"}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="end">
        {/* <DropdownMenuLabel>My Account</DropdownMenuLabel> */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="p-2" asChild>
            <Link to="/profile" className="flex items-center gap-4">
              <User size={16} /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2" asChild>
            <Link to="/orders" className="flex items-center gap-4">
              <ListOrdered size={16} /> Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2" asChild>
            <Link to="/wishlist" className="flex items-center gap-4">
              <Heart size={16} className="text-red-700" /> Wishlist
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-4 text-red-500 p-2"
        >
          <LogOut size={16} /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default Navbar;
