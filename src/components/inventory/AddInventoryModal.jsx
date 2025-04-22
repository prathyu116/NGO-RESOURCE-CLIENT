import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap"; // Using react-bootstrap for easier modal handling
import { useDispatch, useSelector } from "react-redux";
import {
  addInventoryItem,
  clearInventoryError,
  resetAddingStatus,
} from "../../redux/features/inventory/inventorySlice";

// Install react-bootstrap if you haven't: npm install react-bootstrap
// Make sure bootstrap CSS is imported in main.jsx

const AddInventoryModal = ({ show, handleClose }) => {
    console.log("AddInventoryModal rendered",resetAddingStatus); // Debugging line
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [formError, setFormError] = useState(""); // Local form validation error

  const dispatch = useDispatch();
  const { addingStatus, addingError } = useSelector((state) => state.inventory);

  // Clear form and errors when modal is shown/hidden or status changes
  useEffect(() => {
    if (show) {
      setItemName("");
      setCategory("");
      setQuantity("");
      setFormError("");
      dispatch(clearInventoryError()); // Clear Redux error state on open
      dispatch(resetAddingStatus());

    }
  }, [show, dispatch]);

  // Close modal automatically on successful add
  useEffect(() => {
    if (addingStatus === "succeeded" && show) {
    handleClose(); // Close the modal
    dispatch(resetAddingStatus());

    }
  }, [addingStatus, handleClose, show,dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(""); // Clear previous form error

    // Basic Validation
    if (!itemName.trim() || !category.trim() || !quantity) {
      setFormError("All fields are required.");
      return;
    }
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      setFormError("Quantity must be a non-negative number.");
      return;
    }

    dispatch(
      addInventoryItem({
        itemName: itemName.trim(),
        category: category.trim(),
        quantity: qty, // Send as number
      })
    );
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Inventory Item</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {addingError && (
          <Alert variant="danger">
            {typeof addingError === "string"
              ? addingError
              : "Failed to add item."}
          </Alert>
        )}
        {formError && <Alert variant="warning">{formError}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formItemName">
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Rice Bags (5kg)"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCategory">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Food Grains"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
            {/* You could replace this with a <select> if you have predefined categories */}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="e.g., 50"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              min="0" // Prevent negative numbers in HTML5 validation
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="me-2"
              disabled={addingStatus === "loading"}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={addingStatus === "loading"}
            >
              {addingStatus === "loading" ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1"
                  />
                  Adding...
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddInventoryModal;
