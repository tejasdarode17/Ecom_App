import AuthLayout from "./Layouts/AuthLayout"
import AdminLayout from "./Layouts/AdminLayout"
import ShopersLayout from "./Layouts/ShopersLayout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./Main Components/Shopers/Auth/UserLogin"
import Register from "./Main Components/Shopers/Auth/UserRegister"
import Home from "./Main Components/Shopers/Home"
import Dashboard from "./Main Components/Admin/AdminDashboard"
import { Provider } from "react-redux"
import store from "./Redux/Store"
import SellerAuthLayout from "./Layouts/SellerAuthLayout"
import SellerRegister from "./Main Components/Seller/SellerAuth/SellerRegister"
import SellerLogin from "./Main Components/Seller/SellerAuth/SellerLogin"
import SellerDashboard from "./Main Components/Seller/SellerDashboard"
import SellerLayout from "./Layouts/SellerLayout"

const appRouter = createBrowserRouter([
  {
    path: "/user",
    element: <AuthLayout></AuthLayout>,
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
    path: "/seller",
    element: <SellerAuthLayout></SellerAuthLayout>,
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
    path: "/seller/home",
    element: <SellerLayout></SellerLayout>,
    children: [
      {
        path: "dashboard",
        element: <SellerDashboard></SellerDashboard>
      }
    ]
  },

  {
    path: "/",
    element: <ShopersLayout></ShopersLayout>,
    children: [
      {
        path: "",
        element: <Home></Home>
      }
    ]
  }
])


function App() {
  return (
    <>
      <Provider store={store}>
        <RouterProvider router={appRouter}></RouterProvider>
      </Provider>
    </>
  )
}

export default App





