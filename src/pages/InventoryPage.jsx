import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus,FaBox } from "react-icons/fa";
import InventoryList from "../components/inventory/InventoryList";
import AddInventoryModal from "../components/inventory/AddInventoryModal";
import EditInventoryModal from "../components/inventory/EditInventoryModal"; // Import the new modal

const InventoryPage = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // State for Edit modal
  const [currentItemToEdit, setCurrentItemToEdit] = useState(null); // State for item being edited

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  // Function to handle when the Edit button is clicked in the list
  const handleShowEditModal = (item) => {
    setCurrentItemToEdit(item); // Set the item to be edited
    setShowEditModal(true); // Show the edit modal
    // console.log("Editing item:", item); // Keep for debugging if needed
  };

  // Function to handle closing the edit modal
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentItemToEdit(null); // Clear the item being edited
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>
          {" "}
          <FaBox className="me-2 text-primary" />
          Inventory
        </h2>
        <Button variant="primary" onClick={handleShowAddModal}>
          <FaPlus className="me-2" /> Add Inventory
        </Button>
      </div>

      {/* Inventory Table - Pass the handleShowEditModal function */}
      <InventoryList onEditClick={handleShowEditModal} />

      {/* Add Inventory Modal */}
      <AddInventoryModal
        show={showAddModal}
        handleClose={handleCloseAddModal}
      />

      {/* Edit Inventory Modal - Render conditionally */}
      {currentItemToEdit && (
        <EditInventoryModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          itemToEdit={currentItemToEdit}
        />
      )}
    </div>
  );
};

export default InventoryPage;
