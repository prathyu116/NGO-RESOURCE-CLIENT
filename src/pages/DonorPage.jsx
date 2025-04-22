// src/pages/DonorPage.jsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus } from "react-icons/fa"; // Import icon for button
import DonorList from "../components/donors/DonorList";
import AddDonorModal from "../components/donors/AddDonorModal";
import EditDonorModal from "../components/donors/EditDonorModal";

const DonorPage = () => {
  // State for controlling modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  // State to hold the donor data when editing
  const [currentDonorToEdit, setCurrentDonorToEdit] = useState(null);

  // Handlers for Add Modal
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  // Handlers for Edit Modal
  const handleShowEditModal = (donor) => {
    setCurrentDonorToEdit(donor); // Set the donor to edit
    setShowEditModal(true); // Show the modal
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setCurrentDonorToEdit(null); // Clear the donor being edited
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Donor Management</h2>
        <Button variant="primary" onClick={handleShowAddModal}>
          <FaPlus className="me-2" /> Add Donor
        </Button>
      </div>

      {/* Render the list of donors, passing the edit handler */}
      <DonorList onEditClick={handleShowEditModal} />

      {/* Render the Add Donor Modal */}
      <AddDonorModal show={showAddModal} handleClose={handleCloseAddModal} />

      {/* Render the Edit Donor Modal conditionally only when a donor is selected */}
      {currentDonorToEdit && (
        <EditDonorModal
          show={showEditModal}
          handleClose={handleCloseEditModal}
          donorToEdit={currentDonorToEdit}
        />
      )}
    </div>
  );
};

export default DonorPage;
