import React from "react";
import { NavLink } from "react-router-dom";
import { FaBox, FaUsers, FaTruckLoading } from "react-icons/fa"; // Import icons

const SubNavbar = () => {
  // Define base classes for all links
  const baseClasses =
    "nav-link d-flex align-items-center px-3 py-2 rounded mx-1"; // Added padding, rounding, margin, flex alignment
  const inactiveClasses = "text-dark"; // Text color for inactive links

  // Define active classes specific to each link
  const activeInventoryClasses = "bg-primary text-white shadow-sm fw-bold"; // Blue background, white text, shadow, bold
  const activeDonorsClasses = "bg-success text-white shadow-sm fw-bold"; // Green background, white text, shadow, bold
  const activeLogisticsClasses = "bg-warning text-white shadow-sm fw-bold"; // Green background, white text, shadow, bold

  return (
    // Keep the existing navbar structure
    <nav className="navbar navbar-expand-sm navbar-light bg-light shadow-sm mb-4">
      {/* Centering container */}
      <div className="container-fluid d-flex justify-content-center">
        {/* Use nav-pills for button-like styling */}
        <ul className="navbar-nav nav-pills">
          {/* Inventory Link */}
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? activeInventoryClasses : inactiveClasses
                }`
              }
              to="/inventory"
              end // Ensure only exact match is active
              title="Inventory Management" // Tooltip for accessibility/clarity
            >
              <FaBox className="me-2" size="1.1em" /> {/* Icon with margin */}
              <span>Inventory</span>
            </NavLink>
          </li>

          {/* Donors Link */}
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? activeDonorsClasses : inactiveClasses
                }`
              }
              to="/donors" // Matches /donors and /donors/:id - adjust 'end' prop if needed later
              title="Donor Management"
            >
              <FaUsers className="me-2" size="1.1em" />
              <span>Donors</span>
            </NavLink>
          </li>

          {/* Logistics Link */}
          <li className="nav-item">
            <NavLink
              className={({ isActive }) =>
                `${baseClasses} ${
                  isActive ? activeLogisticsClasses : inactiveClasses
                }`
              }
              to="/logistics"
              title="Logistics & Distribution"
            >
              <FaTruckLoading className="me-2" size="1.1em" />
              <span>Logistics</span>
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default SubNavbar;
