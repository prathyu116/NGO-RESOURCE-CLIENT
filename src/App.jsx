// src/App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./pages/DashboardLayout";
import InventoryPage from "./pages/InventoryPage";
import DonorPage from "./pages/DonorPage";
import DonorDetailPage from "./pages/DonorDetailPage"; // Import the new page
import LogisticsPage from "./pages/LogisticsPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { useSelector } from "react-redux";

function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/inventory" /> : <LoginPage />
          }
        />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Navigate to="/inventory" replace />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="donors" element={<DonorPage />} />
            {/* Add route for Donor Detail Page */}
            <Route path="donors/:donorId" element={<DonorDetailPage />} />
            <Route path="logistics" element={<LogisticsPage />} />
            {/* Add other protected routes here */}
          </Route>
        </Route>

        {/* Redirect any other unknown route */}
        <Route
          path="*"
          element={
            <Navigate to={isAuthenticated ? "/inventory" : "/login"} replace />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
