import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// Import a more thematic icon
import { FaHandsHelping, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
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
    // Added py-2 for a little vertical padding
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top py-2 shadow-sm">
      <div className="container-fluid">
        {/* Brand/Logo - stays visible */}
        <Link
          className="navbar-brand d-flex align-items-center"
          to="/"
          title="Dashboard Home"
        >
          <FaHandsHelping size={60} className="me-2 text-info" />{" "}
          {/* New Icon + Color */}
          {/* Optional: Show title only on large screens if needed */}
          {/* <span className="d-none d-lg-inline fw-light">NGO Tracker</span> */}
        </Link>

        {/* Navbar Toggler (Hamburger Menu) */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavContent"
          aria-controls="navbarNavContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Content */}
        <div className="collapse navbar-collapse" id="navbarNavContent">
          {/* This empty nav pushes the title and profile away from the left */}
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Future left-aligned links could go here */}
          </ul>

          {/* Centered Heading - Use mx-lg-auto to center ONLY on large screens */}
          {/* It centers between the `me-auto` above and `ms-auto` below */}
          <span className="navbar-text mx-lg-auto fs-2 fw-bold text-white">
            NGO Resource Tracker
          </span>

          {/* Right Profile Dropdown - ms-auto pushes it to the end */}
          {user && (
            <ul className="navbar-nav fs-4 ms-auto mb-2 mb-lg-0">
              {" "}
              {/* Use ul and ms-auto */}
              <li className="nav-item dropdown">
                <button
                  className="btn btn-dark nav-link dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="profileDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <FaUserCircle size={24} className="me-2" />{" "}
                  {/* Slightly smaller icon */}
                  {/* Show name inline on large screens */}
                  <span className="d-none d-lg-inline">
                    {user.name || user.email}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end dropdown-menu-dark" // Darker dropdown
                  aria-labelledby="profileDropdown"
                >
                  {/* Display user name/email within the dropdown */}
                  <li>
                    <span className="dropdown-item-text px-3 fw-semibold">
                      {" "}
                      {/* Added padding */}
                      {user.name || user.email}
                    </span>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item d-flex align-items-center px-3" // Added padding
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="me-2 opacity-75" /> Logout{" "}
                      {/* Icon subtle */}
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
