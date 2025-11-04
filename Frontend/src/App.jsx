import AuthLayout from "./Layouts/AuthLayout"
import AdminLayout from "./Layouts/AdminLayout"
import ShopersLayout from "./Layouts/ShopersLayout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./Main Components/Shopers/Shoper Auth/UserLogin"
import Register from "./Main Components/Shopers/Shoper Auth/UserRegister"
import Home from "./Main Components/Shopers/Home"
import { useDispatch } from "react-redux"
import SellerAuthLayout from "./Layouts/SellerAuthLayout"
import SellerRegister from "./Main Components/Seller/Seller Auth/SellerRegister"
import SellerLogin from "./Main Components/Seller/Seller Auth/SellerLogin"
import SellerDashboard from "./Main Components/Seller/Seller Dashboard/SellerDashboard"
import SellerLayout from "./Layouts/SellerLayout"
import ProtectedRoutes from "./Main Components/Other/ProtectedRoutes"
import { useEffect } from "react"
import { checkAuth } from "./Redux/authSlice"
import ErrorPage from "./Main Components/Other/ErrorPage"
import { AddNewProduct } from "./Main Components/Seller/Seller Products/AddNewProduct"
import EditProduct from "./Main Components/Seller/Seller Products/EditProduct"
import SellerProducts from "./Main Components/Seller/Seller Products/SellerProducts"
import SellerSingleProduct from "./Main Components/Seller/Seller Products/SellerSingleProduct"
import AdminDashboard from "./Main Components/Admin/Admin Dashboard/AdminDashboard"
import AdminCategory from "./Main Components/Admin/Admin Categories/AdminCategory"
import { fetchAllCategories } from "./Redux/categoriesSlice"
import AdminSellers from "./Main Components/Admin/Manage Sellers/AdminSeller"
import SelectedSeller from "./Main Components/Admin/Manage Sellers/SelectedSeller"
import AdminProductDetail from "./Main Components/Admin/AdminProductDetail"
import PendingSeller from "./Main Components/Admin/Manage Sellers/PendingSeller"
import { fetchAllBanners, fetchAllCarousels } from "./Redux/bannersSlice"
import AdminBanners from "./Main Components/Admin/Banners/AdminBanners"
import ProductsLayout from "./Main Components/Shopers/Products/ProductsLayout"
import ProductDetails from "./Main Components/Shopers/Products/ProductDetails"
import AddCategory from "./Main Components/Admin/Admin Categories/AddCategory"
import EditCategory from "./Main Components/Admin/Admin Categories/EditCategory"
import Cart from "./Main Components/Shopers/Cart/Cart"
import CheckOut from "./Main Components/Shopers/Cart/CheckOut"
import { fetchCartThunk } from "./Redux/cartSlice"


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
      },
      {
        path: "/products",
        element: <ProductsLayout></ProductsLayout>
      },
      {
        path: "/product/:slug",
        element: <ProductDetails></ProductDetails>
      },
      {
        path: "/cart",
        element: <Cart></Cart>
      },
      {
        path: "/checkout",
        element: <CheckOut></CheckOut>
      },
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
        element: <SellerProducts></SellerProducts>
      },
      {
        path: "add-product",
        element: <AddNewProduct></AddNewProduct>
      },
      {
        path: "edit-product/:id",
        element: <EditProduct></EditProduct>
      },
      {
        path: "product/:id",
        element: <SellerSingleProduct></SellerSingleProduct>
      }
    ]
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoutes>
        <AdminLayout></AdminLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard></AdminDashboard>
      },
      {
        path: "category",
        element: <AdminCategory></AdminCategory>
      },
      {
        path: "add-category",
        element: <AddCategory></AddCategory>
      },
      {
        path: "edit-category/:id",
        element: < EditCategory ></EditCategory >
      },
      {
        path: "sellers",
        element: <AdminSellers></AdminSellers>
      },
      {
        path: "seller/:id",
        element: <SelectedSeller></SelectedSeller>
      },
      {
        path: "seller/pending",
        element: <PendingSeller></PendingSeller>
      },
      {
        path: "product/:id",
        element: <AdminProductDetail></AdminProductDetail>
      },
      {
        path: "banners",
        element: <AdminBanners></AdminBanners>
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

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchAllCategories())
    dispatch(fetchAllCarousels())
    dispatch(fetchAllBanners())
    dispatch(fetchCartThunk())

  }, []);

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App





