// src/components/common/SubNavbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";

const SubNavbar = () => {
  return (
    // Expand at small breakpoint
    <nav className="navbar navbar-expand-sm navbar-light bg-light shadow-sm mb-4">
      {/* Centering container */}
      <div className="container-fluid d-flex justify-content-center">
        {/* No toggler needed for just 3 items unless preferred */}
        {/* Links */}
        <ul className="navbar-nav nav-pills">
          {" "}
          {/* nav-pills for styling */}
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/inventory"
              end
            >
              Inventory
              {/* Shorten text for smaller screens if needed */}
              {/* <span className="d-none d-sm-inline"> Management</span> */}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/donors"
            >
              Donors
              {/* <span className="d-none d-sm-inline"> Management</span> */}
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
              to="/logistics"
            >
              Logistics
              {/* <span className="d-none d-sm-inline"> & Distribution</span> */}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SubNavbar;
