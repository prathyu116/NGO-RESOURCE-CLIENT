// src/pages/LogisticsPage.jsx
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaPlus, FaTruckLoading } from "react-icons/fa"; // Added icons
import LogisticsList from "../components/logistics/LogisticsList";
import CreateShipmentModal from "../components/logistics/CreateShipmentModal";

const LogisticsPage = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FaTruckLoading className="me-2 text-warning" /> Logistics &
          Distribution
        </h2>
        <Button variant="warning" onClick={handleShowCreateModal}>
          <FaPlus className="me-2" /> Create Shipment
        </Button>
      </div>

      {/* Render the list of logistics records */}
      <LogisticsList />

      {/* Render the Create Shipment Modal */}
      <CreateShipmentModal
        show={showCreateModal}
        handleClose={handleCloseCreateModal}
      />
    </div>
  );
};

export default LogisticsPage;
