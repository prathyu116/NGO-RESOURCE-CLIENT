import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Spinner, Alert, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { fetchInventory } from "../../redux/features/inventory/inventorySlice"; // Fetch inventory items
import {
  createShipmentAndUpdateInventory,
  resetCreatingStatus,
  clearLogisticsError,
} from "../../redux/features/logistics/logisticsSlice";

const CreateShipmentModal = ({ show, handleClose }) => {
  const dispatch = useDispatch();

  // Form State
  const [destination, setDestination] = useState("");
  const [selectedInventoryId, setSelectedInventoryId] = useState("");
  const [quantityShipped, setQuantityShipped] = useState("");
  const [formError, setFormError] = useState("");
  const [maxQuantity, setMaxQuantity] = useState(0); // To store available qty of selected item

  // Redux State
  const { items: inventoryItems, status: inventoryStatus } = useSelector(
    (state) => state.inventory
  );
  const { creatingStatus, creatingError } = useSelector(
    (state) => state.logistics
  );

  // Fetch inventory when modal might be shown or if inventory is not loaded
  useEffect(() => {
    if (show && inventoryStatus === "idle") {
      dispatch(fetchInventory());
    }
  }, [show, inventoryStatus, dispatch]);

  // Reset form when modal opens
  useEffect(() => {
    if (show) {
      setDestination("");
      setSelectedInventoryId("");
      setQuantityShipped("");
      setFormError("");
      setMaxQuantity(0);
      dispatch(resetCreatingStatus());
      dispatch(clearLogisticsError());
    }
  }, [show, dispatch]);

  // Update max quantity and clear quantity input when selected item changes
  useEffect(() => {
    if (selectedInventoryId) {
      const selectedItem = inventoryItems.find(
        (item) => item.id === selectedInventoryId
      );
      setMaxQuantity(selectedItem ? selectedItem.quantity : 0);
      setQuantityShipped(""); // Reset quantity when item changes
      setFormError(""); // Clear previous quantity errors
    } else {
      setMaxQuantity(0);
    }
  }, [selectedInventoryId, inventoryItems]);

  // Close modal on successful creation
  useEffect(() => {
    if (creatingStatus === "succeeded" && show) {
      handleClose();
    }
  }, [creatingStatus, show, handleClose]);

  // Handle Quantity Change and Validation
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    setQuantityShipped(value); // Update state first

    // Validate only if a value is entered
    if (value) {
      const qty = parseInt(value, 10);
      if (isNaN(qty) || qty <= 0) {
        setFormError("Quantity must be a positive number.");
      } else if (qty > maxQuantity) {
        setFormError(`Cannot ship more than available (${maxQuantity}).`);
      } else {
        setFormError(""); // Clear error if valid
      }
    } else {
      setFormError(""); // Clear error if empty
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(""); // Clear previous errors

    // Final Validation
    if (!destination.trim()) return setFormError("Destination is required.");
    if (!selectedInventoryId)
      return setFormError("Please select an item from inventory.");
    if (!quantityShipped) return setFormError("Quantity to ship is required.");

    const qty = parseInt(quantityShipped, 10);
    if (isNaN(qty) || qty <= 0)
      return setFormError("Quantity must be a positive number.");
    if (qty > maxQuantity)
      return setFormError(`Cannot ship more than available (${maxQuantity}).`);

    // Dispatch the action
    dispatch(
      createShipmentAndUpdateInventory({
        destination: destination.trim(),
        inventoryItemId: selectedInventoryId,
        quantityShipped: qty,
      })
    );
  };

  // Filter inventory items with quantity > 0 for the dropdown
  const availableInventory = inventoryItems.filter((item) => item.quantity > 0);

  return (
    <Modal show={show} onHide={handleClose} centered backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Create New Shipment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {creatingError && (
          <Alert variant="danger">Error: {creatingError}</Alert>
        )}
        {formError && <Alert variant="warning">{formError}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formDestination">
            <Form.Label>Destination*</Form.Label>
            <Form.Control
              type="text"
              placeholder="e.g., Community Center Alpha"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formInventoryItem">
            <Form.Label>Item to Ship*</Form.Label>
            <Form.Select
              value={selectedInventoryId}
              onChange={(e) => setSelectedInventoryId(e.target.value)}
              required
              disabled={inventoryStatus === "loading"}
            >
              <option value="">-- Select an Item --</option>
              {inventoryStatus === "loading" && (
                <option disabled>Loading inventory...</option>
              )}
              {availableInventory.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.itemName} ({item.category}) - Available: {item.quantity}
                </option>
              ))}
              {inventoryStatus === "succeeded" &&
                availableInventory.length === 0 && (
                  <option disabled>
                    No items with quantity greater than 0 in inventory.
                  </option>
                )}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formQuantityShipped">
            <Form.Label>Quantity to Ship*</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              value={quantityShipped}
              onChange={handleQuantityChange} // Use custom handler
              required
              min="1"
              max={maxQuantity > 0 ? maxQuantity : undefined} // Set HTML5 max based on availability
              disabled={!selectedInventoryId || maxQuantity === 0} // Disable if no item selected or none available
            />
            {selectedInventoryId && maxQuantity > 0 && (
              <Form.Text muted>Available: {maxQuantity}</Form.Text>
            )}
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button
              variant="secondary"
              onClick={handleClose}
              className="me-2"
              disabled={creatingStatus === "loading"}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={
                creatingStatus === "loading" ||
                !!formError ||
                !selectedInventoryId ||
                !quantityShipped
              }
            >
              {creatingStatus === "loading" ? (
                <>
                  {" "}
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-1"
                  />{" "}
                  Creating...{" "}
                </>
              ) : (
                "Create Shipment"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateShipmentModal;
