// src/components/common/Navbar.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaWarehouse, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { logout } from "../../redux/features/auth/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    // Make navbar expand at large breakpoint, collapse below
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container-fluid">
        {/* Brand/Logo - stays visible */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <FaWarehouse size={30} className="me-2" />
          {/* Optional: Add short title next to logo for small screens */}
          {/* <span className="d-lg-none ms-1">NGO Tracker</span> */}
        </Link>

        {/* Navbar Toggler (Hamburger Menu) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavContent" // Points to the collapsible content ID
          aria-controls="navbarNavContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarNavContent">
          {/* Middle Heading - centered on large screens, left-aligned in collapse */}
          <span className="navbar-text mx-lg-auto fs-4 fw-bold text-white">
            NGO Resource Tracker
          </span>

          {/* Right Profile Dropdown - pushed to end on large screens */}
          {user && (
            <ul className="navbar-nav ms-lg-auto mb-2 mb-lg-0">
              {" "}
              {/* Use ul for semantics */}
              <li className="nav-item dropdown">
                <button
                  className="btn btn-dark nav-link dropdown-toggle d-flex align-items-center" // Use nav-link for styling consistency
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle size={25} className="me-2" />
                  <span className="d-none d-lg-inline">
                    {user.name || user.email}
                  </span>{" "}
                  {/* Show name only on large screens */}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="profileDropdown"
                >
                  <li>
                    <span className="dropdown-item-text fw-bold">
                      {user.name || user.email}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2" /> Logout
                    </button>
                  </li>
                </ul>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
