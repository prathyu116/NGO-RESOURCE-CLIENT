import React, { useEffect, useState } from "react"; // Added useState
import { useSelector, useDispatch } from "react-redux";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa"; // Added FaInfoCircle
import {
  fetchInventory,
  deleteInventoryItem,
  clearInventoryError,
} from "../../redux/features/inventory/inventorySlice";
import ItemDonorsModal from "./ItemDonorsModal"; // Import the new modal

const InventoryList = ({ onEditClick }) => {
  const dispatch = useDispatch();
  const { items, status, error, deletingStatus, deletingError } = useSelector(
    (state) => state.inventory
  );

  // State for the Item Donors Modal
  const [showDonorsModal, setShowDonorsModal] = useState(false);
  const [selectedItemForDonors, setSelectedItemForDonors] = useState(null);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      // Fetch if idle or previously failed
      dispatch(clearInventoryError());
      dispatch(fetchInventory());
    }
  }, [status, dispatch]);

  const handleDelete = (itemId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this inventory item? This will not affect donation history but will remove the total count."
      )
    ) {
      dispatch(clearInventoryError());
      dispatch(deleteInventoryItem(itemId));
    }
  };

  // Handler to show the donors modal
  const handleShowDonors = (item) => {
    setSelectedItemForDonors(item);
    setShowDonorsModal(true);
  };

  const handleCloseDonorsModal = () => {
    setShowDonorsModal(false);
    setSelectedItemForDonors(null);
  };

  let content;

  if (status === "loading") {
    content = (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p>Loading Inventory...</p>
      </div>
    );
  } else if (status === "succeeded") {
    if (items.length === 0) {
      content = (
        <Alert variant="info" className="text-center">
          {" "}
          No inventory items found. Add some via Donations!{" "}
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
                <th>Item Name (View Donors)</th> {/* Updated Header */}
                <th>Category</th>
                <th>Total Quantity</th> {/* Updated Header */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>
                    {/* Make item name clickable */}
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 text-start" // Adjust styling as needed
                      onClick={() => handleShowDonors(item)}
                      title={`View donors for ${item.itemName}`}
                    >
                      {item.itemName}{" "}
                      <FaInfoCircle size={12} className="ms-1 text-secondary" />
                    </Button>
                  </td>
                  <td>{item.category}</td>
                  <td>{item.quantity}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => onEditClick(item)}
                      title="Edit Item Details"
                    >
                      {" "}
                      <FaEdit />{" "}
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingStatus === "loading"}
                      title="Delete Item"
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
      {/* Deleting errors */}
      {deletingStatus === "failed" && (
        <Alert
          variant="danger"
          onClose={() => dispatch(clearInventoryError())}
          dismissible
        >
          {" "}
          Error deleting item:{" "}
          {typeof deletingError === "string"
            ? deletingError
            : "Failed to delete"}{" "}
        </Alert>
      )}

      {content}

      {/* Item Donors Modal - Render conditionally */}
      {selectedItemForDonors && (
        <ItemDonorsModal
          show={showDonorsModal}
          handleClose={handleCloseDonorsModal}
          item={selectedItemForDonors}
        />
      )}
    </div>
  );
};

export default InventoryList;