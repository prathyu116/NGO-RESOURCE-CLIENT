import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  // If authenticated, render the child routes (Outlet).
  // Otherwise, redirect to the login page.
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
