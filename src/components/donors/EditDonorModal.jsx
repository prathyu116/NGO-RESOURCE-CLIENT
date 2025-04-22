// src/components/donors/EditDonorModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  updateDonor,
  clearDonorError,
  resetUpdatingDonorStatus,
} from "../../redux/features/donors/donorSlice";

const EditDonorModal = ({ show, handleClose, donorToEdit }) => {
  // Initialize state with empty strings or default values
  const [name, setName] = useState("");
  const [type, setType] = useState("Individual");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const { updatingStatus, updatingError } = useSelector(
    (state) => state.donors
  );

  // Pre-fill form when modal opens or donorToEdit changes
  useEffect(() => {
    if (show && donorToEdit) {
      setName(donorToEdit.name || "");
      setType(donorToEdit.type || "Individual");
      setContactPerson(donorToEdit.contactPerson || "");
      setEmail(donorToEdit.email || "");
      setPhone(donorToEdit.phone || "");
      setAddress(donorToEdit.address || "");
      setFormError(""); // Clear previous errors
      dispatch(clearDonorError()); // Clear Redux error state
      dispatch(resetUpdatingDonorStatus()); // Ensure status is idle
    }
  }, [show, donorToEdit, dispatch]);

  // Close modal automatically on successful update
  useEffect(() => {
    if (updatingStatus === "succeeded" && show) {
      handleClose(); // Close the modal
      // Status reset handled by effect above when modal re-opens or donor changes
    }
  }, [updatingStatus, handleClose, show]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Basic Validation
    if (!name.trim()) {
      setFormError("Donor name is required.");
      return;
    }
    if (type === "Organization" && !contactPerson.trim()) {
      setFormError("Contact person is required for organizations.");
      return;
    }
    // Add more validation as needed

    const updatedData = {
      // Include all fields expected by the API (PUT requires the full object for json-server usually)
      id: donorToEdit.id, // Keep the original ID
      name: name.trim(),
      type,
      contactPerson: type === "Organization" ? contactPerson.trim() : "",
      email: email.trim(),
      phone: phone.trim(),
      address: address.trim(),
    };

    dispatch(updateDonor({ id: donorToEdit.id, updatedData }));
  };

  // Don't render the modal if there's no donor to edit (prevents errors on first render)
  if (!donorToEdit) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Edit Donor</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display Redux update error */}
        {updatingError && (
          <Alert variant="danger">
            Failed to update donor:{" "}
            {typeof updatingError === "string" ? updatingError : "Server error"}
          </Alert>
        )}
        {/* Display local form validation error */}
        {formError && <Alert variant="warning">{formError}</Alert>}

        <Form onSubmit={handleSubmit}>
          {/* Form fields are identical to AddDonorModal, but pre-filled */}
          <Form.Group className="mb-3" controlId="editFormDonorName">
            <Form.Label>Donor Name*</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editFormDonorType">
            <Form.Label>Type*</Form.Label>
            <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="Individual">Individual</option>
              <option value="Organization">Organization</option>
            </Form.Select>
          </Form.Group>

          {type === "Organization" && (
            <Form.Group className="mb-3" controlId="editFormContactPerson">
              <Form.Label>Contact Person*</Form.Label>
              <Form.Control
                type="text"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                required={type === "Organization"}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="editFormDonorEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editFormDonorPhone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editFormDonorAddress">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </Form.Group>

          {/* Footer Buttons */}
          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="me-2"
              disabled={updatingStatus === "loading"}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={updatingStatus === "loading"}
            >
              {updatingStatus === "loading" ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditDonorModal;
