import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {

    const { isAuthenticated, userData } = useSelector((store) => store.auth);

    const { role } = userData || {};

    const location = useLocation()
    const path = location.pathname


    if (!isAuthenticated) {
        if (path.startsWith("/seller") && !path.startsWith("/seller/auth")) {
            return <Navigate to="/seller/auth/login" replace />;
        }
        if (path.startsWith("/admin")) {
            return <Navigate to="/" replace />;
        }
    }

    if (role === "seller") {
        if (path.startsWith("/seller/auth") || path.startsWith("/user/auth") || path === "/") {
            return <Navigate to="/seller" replace />;
        }
    }

    if (role === "user") {
        if (path.startsWith("/seller") || path.startsWith("/user/auth") || path.startsWith("/admin")) {
            return <Navigate to="/" replace />;
        }
    }

    if (role === "admin") {
        if (path === "/") return <Navigate to="/admin" replace />;
        if (path.startsWith("/seller") || path.startsWith("/user/auth")) {
            return <Navigate to="/admin" replace />;
        }
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoutes


