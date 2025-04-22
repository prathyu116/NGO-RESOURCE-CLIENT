// src/components/donors/DonorList.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { FaEdit, FaTrash, FaBuilding, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom"; // Import Link
import {
  fetchDonors,
  deleteDonor,
  clearDonorError,
  resetDeletingDonorStatus,
} from "../../redux/features/donors/donorSlice";

const DonorList = ({ onEditClick }) => {
  // ... (keep existing useEffects and handleDelete) ...
  const dispatch = useDispatch();
  const {
    items: donors,
    status,
    error,
    deletingStatus,
    deletingError,
  } = useSelector((state) => state.donors);

  // Fetch donors when component mounts or if status was failed
  useEffect(() => {
    // Fetch only if not already loaded or loading or failed previously
    if (status === "idle" || status === "failed") {
      dispatch(clearDonorError()); // Clear previous errors
      dispatch(fetchDonors());
    }
  }, [status, dispatch]);

  const handleDelete = (donorId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this donor? This may orphan donation records."
      )
    ) {
      // Added warning
      dispatch(clearDonorError()); // Clear previous errors
      dispatch(deleteDonor(donorId));
    }
  };

  let content;

  if (status === "loading") {
    content = (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading Donors...</span>
        </Spinner>
        <p>Loading Donors...</p>
      </div>
    );
  } else if (status === "succeeded") {
    if (!donors || donors.length === 0) {
      content = (
        <Alert variant="info" className="text-center">
          {" "}
          No donors found. Add one to get started!{" "}
        </Alert>
      );
    } else {
      content = (
        <div className="table-responsive">
          <Table
            striped
            bordered
            hover
            responsive="sm"
            className="align-middle"
          >
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Name (View History)</th> {/* Updated Header */}
                <th>Type</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Contact Person</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {donors.map((donor, index) => (
                <tr key={donor.id}>
                  <td>{index + 1}</td>
                  <td>
                    {/* Link to Donor Detail Page */}
                    <Link
                      to={`/donors/${donor.id}`}
                      title={`View ${donor.name}'s Donation History`}
                    >
                      {donor.name}
                    </Link>
                  </td>
                  <td>
                    {donor.type === "Organization" ? (
                      <FaBuilding title="Organization" className="me-1" />
                    ) : (
                      <FaUser title="Individual" className="me-1" />
                    )}
                    {donor.type}
                  </td>
                  <td>{donor.email || "N/A"}</td>
                  <td>{donor.phone || "N/A"}</td>
                  <td>{donor.contactPerson || "N/A"}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2 mb-1 mb-md-0"
                      onClick={() => onEditClick(donor)}
                      title="Edit Donor Details"
                    >
                      {" "}
                      <FaEdit />{" "}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(donor.id)}
                      disabled={deletingStatus === "loading"}
                      title="Delete Donor"
                    >
                      {deletingStatus === "loading" ? (
                        <Spinner as="span" animation="border" size="sm" />
                      ) : (
                        <FaTrash />
                      )}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }
  } else if (status === "loading") {
    /* ... loading spinner ... */
  } else if (status === "failed") {
    /* ... error alert ... */
  }

  return (
    <div>
      {/* Display deleting errors prominently */}
      {deletingStatus === "failed" && (
        <Alert
          variant="danger"
          onClose={() => dispatch(resetDeletingDonorStatus())} // Use reset action
          dismissible
          className="mt-3"
        >
          Error deleting donor:{" "}
          {typeof deletingError === "string"
            ? deletingError
            : "Failed to delete"}
        </Alert>
      )}
      {content}
    </div>
  );
};

export default DonorList;
