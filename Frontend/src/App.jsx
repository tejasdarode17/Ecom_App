import AuthLayout from "./Layouts/AuthLayout"
import AdminLayout from "./Layouts/AdminLayout"
import ShopersLayout from "./Layouts/ShopersLayout"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Login from "./Main Components/Auth/Login"
import Register from "./Main Components/Auth/Register"
import Home from "./Main Components/Shopers/Home"
import Dashboard from "./Main Components/Admin/Dashboard"
import { Provider } from "react-redux"
import store from "./Redux/Store"

const appRouter = createBrowserRouter([
  {
    path: "/auth",
    element: <AuthLayout></AuthLayout>,
    children: [
      {
        path: "",
        element: <Login></Login>
      },
      {
        path: "register",
        element: <Register></Register>
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
    path: "/home",
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





