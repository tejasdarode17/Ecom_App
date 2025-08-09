import AuthLayout from "./Layouts/AuthLayout"
import AdminLayout from "./Layouts/AdminLayout"
import ShopersLayout from "./Layouts/ShopersLayout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./Main Components/Shopers/Auth/UserLogin"
import Register from "./Main Components/Shopers/Auth/UserRegister"
import Home from "./Main Components/Shopers/Home"
import Dashboard from "./Main Components/Admin/AdminDashboard"
import { useDispatch } from "react-redux"
import SellerAuthLayout from "./Layouts/SellerAuthLayout"
import SellerRegister from "./Main Components/Seller/SellerAuth/SellerRegister"
import SellerLogin from "./Main Components/Seller/SellerAuth/SellerLogin"
import SellerDashboard from "./Main Components/Seller/SellerDashboard"
import SellerLayout from "./Layouts/SellerLayout"
import ProtectedRoutes from "./Redux/ProtectedRoutes"
import axios from "axios"
import { useEffect, useState } from "react"
import { setUser } from "./Redux/authSlice"
import ErrorPage from "./Main Components/ErrorPage"
import Products from "./Main Components/Seller/SellerProducts/Products"
import { AddNewProduct } from "./Main Components/Seller/SellerProducts/AddNewProduct"
import EditProduct from "./Main Components/Seller/SellerProducts/EditProduct"


const appRouter = createBrowserRouter([
  {
    path: "/user/auth",
    element: (
      <ProtectedRoutes>
        <AuthLayout></AuthLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "login",
        element: <Login></Login>
      },
      {
        path: "register",
        element: <Register></Register>
      }
    ]
  },

  {
    path: "/seller/auth",
    element: (
      <ProtectedRoutes>
        <SellerAuthLayout></SellerAuthLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "register",
        element: <SellerRegister></SellerRegister>
      },
      {
        path: "login",
        element: <SellerLogin></SellerLogin>
      }
    ]
  },

  {
    path: "/",
    element: (
      <ProtectedRoutes>
        <ShopersLayout></ShopersLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <Home></Home>
      }
    ]
  },

  {
    path: "/seller",
    element: (
      <ProtectedRoutes>
        <SellerLayout></SellerLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <SellerDashboard></SellerDashboard>
      },
      {
        path: "products",
        element: <Products></Products>,
      },
      {
        path: "add-product",
        element: <AddNewProduct></AddNewProduct>
      },
      {
        path: "edit-product",
        element: <EditProduct></EditProduct>
      }
    ]
  },

  {
    path: "/admin",
    element: <AdminLayout></AdminLayout>,
    children: [
      {
        path: "dashboard",
        element: <Dashboard></Dashboard>
      }
    ]
  },

  {
    path: "*",
    element: <ErrorPage />
  }
])


function App() {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)

        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/user/check-auth`, {
          withCredentials: true,
        });

        dispatch(setUser(res.data.user));
        console.log(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App





