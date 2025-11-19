import AuthLayout from "./Layouts/AuthLayout"
import AdminLayout from "./Layouts/AdminLayout"
import ShopersLayout from "./Layouts/ShopersLayout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./Main Components/Shopers/User Auth/UserLogin"
import Register from "./Main Components/Shopers/User Auth/UserRegister"
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
import AdminSellers from "./Main Components/Admin/Manage Sellers/AdminSeller"
import SelectedSeller from "./Main Components/Admin/Manage Sellers/SelectedSeller"
import AdminProductDetail from "./Main Components/Admin/Manage Sellers/AdminProductDetail"
import PendingSeller from "./Main Components/Admin/Manage Sellers/PendingSeller"
import AdminBanners from "./Main Components/Admin/Banners/AdminBanners"
import ProductsLayout from "./Main Components/Shopers/Products/ProductsLayout"
import ProductDetails from "./Main Components/Shopers/Products/ProductDetails"
import AddCategory from "./Main Components/Admin/Admin Categories/AddCategory"
import EditCategory from "./Main Components/Admin/Admin Categories/EditCategory"
import Cart from "./Main Components/Shopers/Cart/Cart"
import CheckOut from "./Main Components/Shopers/Cart/CheckOut"
import SellerOrders from "./Main Components/Seller/Seller Orders/SellerOrders"
import Orders from "./Main Components/Shopers/User Orders/Orders"
import SellerOrderDetails from "./Main Components/Seller/Seller Orders/SellerOrderDetails"
import OrderDetails from "./Main Components/Shopers/User Orders/OrderDetails"
import AdminOrders from "./Main Components/Admin/Admin Orders/AdminOrders"
import DeliveryAuthLayout from "./Layouts/DeliveryAuthLayout"
import DeliveryLogin from "./Main Components/DeliveryPartner/Delivery Auth/DeliveryLogin"
import DeliveryRegistration from "./Main Components/DeliveryPartner/Delivery Auth/DeliveryRegistration"
import DeliveryLayout from "./Layouts/DeliveryLayout"
import DeliveryDashboard from "./Main Components/DeliveryPartner/DeliveryDashboard"
import DeliveryOrders from "./Main Components/DeliveryPartner/DeliveryOrders"


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
    path: "/delivery/auth",
    element: (
      <ProtectedRoutes>
        <DeliveryAuthLayout></DeliveryAuthLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        path: "register",
        element: <DeliveryRegistration></DeliveryRegistration>
      },
      {
        path: "login",
        element: <DeliveryLogin></DeliveryLogin>
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
      {
        path: "/orders",
        element: <Orders></Orders>
      },
      {
        path: "/order/:id",
        element: <OrderDetails></OrderDetails>
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
        element: <SellerProducts></SellerProducts>
      },
      {
        path: "add-product",
        element: <AddNewProduct></AddNewProduct>
      },
      {
        path: "edit-product/:slug",
        element: <EditProduct></EditProduct>
      },
      {
        path: "product/:slug",
        element: <SellerSingleProduct></SellerSingleProduct>
      },
      {
        path: "orders",
        element: <SellerOrders></SellerOrders>
      },
      {
        path: "order/:id",
        element: <SellerOrderDetails></SellerOrderDetails>
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
      },
      {
        path: "orders",
        element: <AdminOrders></AdminOrders>
      }
    ]
  },

  {
    path: "/delivery",
    element: (
      <ProtectedRoutes>
        <DeliveryLayout></DeliveryLayout>
      </ProtectedRoutes>
    ),
    children: [
      {
        index: true,
        element: <DeliveryDashboard></DeliveryDashboard>
      },
      {
        path: "orders",
        element: <DeliveryOrders></DeliveryOrders>
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
  }, []);

  return (
    <>
      <RouterProvider router={appRouter}></RouterProvider>
    </>
  )
}

export default App





