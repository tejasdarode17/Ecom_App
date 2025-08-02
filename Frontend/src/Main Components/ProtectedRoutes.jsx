import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {

    const { isAuthenticated, userData } = useSelector((store) => store.auth);

    const location = useLocation()
    const path = location.pathname


    //Seller is not authenticated  || login and tries to access seller pages (except login/register)
    if (userData.role == "seller" && !isAuthenticated && !(path.startsWith("/seller/auth/login") || path.startsWith("/seller/auth/register"))
    ) return <Navigate to="/seller/auth/login" replace />;

    
    // Seller is already authenticated || login but tries to access login/register again
    if (isAuthenticated && userData.role === "seller" && (path.startsWith("/seller/auth/login") || path.startsWith("/seller/auth/register"))
    ) return <Navigate to="/seller" replace />;


    //  if seller is logged in tries to accces the common login/register page agian 
    if (isAuthenticated && userData.role === "seller" && path.startsWith("/user/auth")) {
        return <Navigate to="/" replace />;
    }

    //Shopper (user) is logged in and tries to access seller pages
    if (isAuthenticated && userData.role === "user" && path.startsWith("/seller")) {
        return <Navigate to="/" replace />;
    }

    //shopper (user) or seller is logged in tries to accces the login/register page agian 
    if (isAuthenticated && userData.role === "user" && path.startsWith("/user/auth")) {
        return <Navigate to="/" replace />;
    }

    // 4. Seller is logged in and tries to go to shopper home "/"
    if (isAuthenticated && userData.role === "seller" && path === "/") {
        return <Navigate to="/seller" replace />;
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoutes


