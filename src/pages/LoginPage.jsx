import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser, clearAuthError } from "../redux/features/auth/authSlice";
import { FaSignInAlt, FaWarehouse } from "react-icons/fa"; // Import icons

const LoginPage = () => {
  const [email, setEmail] = useState("admin@ngo.com"); // Pre-fill for convenience
  const [password, setPassword] = useState("password123"); // Pre-fill for convenience
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // If already authenticated, redirect away from login
    if (isAuthenticated) {
      navigate("/inventory"); // Or '/' which redirects to inventory
    }
    // Clear any previous login errors when component mounts
    dispatch(clearAuthError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="container vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="card-body p-4">
          <div className="text-center mb-4">
            <FaWarehouse size={50} className="text-primary mb-3" />
            <h3 className="card-title mb-1">Admin Login</h3>
            <p className="text-muted">NGO Resource Tracker</p>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="emailInput" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="emailInput"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@ngo.com"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="passwordInput"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="password123"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Logging in...
                </>
              ) : (
                <>
                  <FaSignInAlt className="me-2" /> Login
                </>
              )}
            </button>
          </form>
          {/* Optional: Add credentials hint for demo */}
          <p className="text-center text-muted mt-3 small">
            Use: admin@ngo.com / password123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
