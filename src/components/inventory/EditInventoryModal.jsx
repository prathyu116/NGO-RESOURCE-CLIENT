// src/components/inventory/EditInventoryModal.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  updateInventoryItem,
  clearInventoryError,
  resetUpdatingStatus,
} from "../../redux/features/inventory/inventorySlice";

const EditInventoryModal = ({ show, handleClose, itemToEdit }) => {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [formError, setFormError] = useState("");

  const dispatch = useDispatch();
  const { updatingStatus, updatingError } = useSelector(
    (state) => state.inventory
  );

  // Pre-fill form when modal opens or itemToEdit changes
  useEffect(() => {
    if (show && itemToEdit) {
      setItemName(itemToEdit.itemName || "");
      setCategory(itemToEdit.category || "");
      setQuantity(
        itemToEdit.quantity !== undefined ? String(itemToEdit.quantity) : ""
      ); // Ensure quantity is a string for input
      setFormError(""); // Clear errors when a new item is loaded
      dispatch(clearInventoryError()); // Clear Redux error state
             dispatch(resetUpdatingStatus());

    }
  }, [show,itemToEdit, dispatch]); // Dependency includes itemToEdit

  // Effect to clear form and errors only when modal visibility changes to hidden
//   useEffect(() => {
//     if (!show) {
//       // Optional: Clear fields when modal is closed, or rely on pre-fill next time it opens
//       // setItemName('');
//       // setCategory('');
//       // setQuantity('');
//       setFormError("");
//       dispatch(clearInventoryError()); // Clear Redux error state on close
//     }
//   }, [show, dispatch]);

  // Close modal automatically on successful update
  useEffect(() => {
    if (updatingStatus === "succeeded" && show) {
      handleClose(); // Close the modal
             dispatch(resetUpdatingStatus());

    }
  }, [updatingStatus, handleClose, show, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(""); // Clear previous form error

    // Basic Validation
    if (!itemName.trim() || !category.trim() || quantity === "") {
      // Check if quantity is empty string
      setFormError("All fields are required.");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setFormError("Quantity must be a non-negative number.");
      return;
    }

    // Prepare the updated data object
    const updatedData = {
      // Include all fields expected by the API (PUT usually requires the full object)
      id: itemToEdit.id, // Keep the original ID
      itemName: itemName.trim(),
      category: category.trim(),
      quantity: qty,
    };

    dispatch(updateInventoryItem({ id: itemToEdit.id, updatedData }));
  };

  // Don't render the modal if there's no item to edit
  if (!itemToEdit) {
    return null;
  }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Inventory Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display Redux update error */}
        {updatingError && (
          <Alert variant="danger">
            {typeof updatingError === "string"
              ? updatingError
              : "Failed to update item."}
          </Alert>
        )}
        {/* Display local form validation error */}
        {formError && <Alert variant="warning">{formError}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="editFormItemName">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Rice Bags (5kg)"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editFormCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Food Grains"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editFormQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0"
            />
          </Form.Group>

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

export default EditInventoryModal;
