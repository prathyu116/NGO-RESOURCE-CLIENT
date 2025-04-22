import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import SubNavbar from "../components/common/SubNavbar";
import { useSelector } from "react-redux";

const DashboardLayout = () => {
  // Optional: Double check authentication here if needed, though ProtectedRoute handles it
  const { isAuthenticated } = useSelector((state) => state.auth);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <Navbar />
      <SubNavbar />
      <main className="container mt-4">
        {" "}
        {/* Add container and margin */}
        <Outlet /> {/* Renders the matched child route (InventoryPage, etc.) */}
      </main>
    </div>
  );
};

export default DashboardLayout;
