// src/components/logistics/LogisticsList.jsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Table, Spinner, Alert, Badge, Form, Button } from "react-bootstrap"; // Added Form, Button
import {
  fetchLogistics,
  updateShipmentStatus,
  resetUpdatingStatus,
  clearLogisticsError,
} from "../../redux/features/logistics/logisticsSlice";

const LogisticsList = () => {
  const dispatch = useDispatch();
  const {
    items: logisticsItems,
    status,
    error,
    updatingStatus,
    updatingError,
    updatingItemId, // To show spinner/error on specific row
  } = useSelector((state) => state.logistics);

  // Define possible statuses
  const shipmentStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];

  // Fetch logistics records on mount or if status failed
  useEffect(() => {
    if (status === "idle" || status === "failed") {
      dispatch(clearLogisticsError());
      dispatch(fetchLogistics());
    }
  }, [status, dispatch]);

  // Clear updating errors when component unmounts
  useEffect(() => {
    return () => {
      dispatch(resetUpdatingStatus());
    };
  }, [dispatch]);

  const handleStatusChange = (e, itemId) => {
    const newStatus = e.target.value;
    if (newStatus) {
      dispatch(clearLogisticsError()); // Clear previous errors
      dispatch(updateShipmentStatus({ id: itemId, status: newStatus }));
    }
  };

  // Function to get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "warning";
      case "Shipped":
        return "info";
      case "Delivered":
        return "success";
      case "Cancelled":
        return "secondary";
      default:
        return "light";
    }
  };

  let content;

  if (status === "loading") {
    content = (
      <div className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading Logistics...</p>
      </div>
    );
  } else if (status === "failed") {
    content = <Alert variant="danger">Error loading logistics: {error}</Alert>;
  } else if (status === "succeeded") {
    if (!logisticsItems || logisticsItems.length === 0) {
      content = (
        <Alert variant="info" className="text-center">
          No shipment records found. Create one!
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
                <th>Created</th>
                <th>Destination</th>
                <th>Item</th>
                <th>Category</th>
                <th>Qty Shipped</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>
            <tbody>
              {logisticsItems.map((item, index) => (
                <tr key={item.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(item.creationDate).toLocaleDateString()}</td>
                  <td>{item.destination}</td>
                  <td>{item.itemName}</td>
                  <td>{item.category}</td>
                  <td>{item.quantityShipped}</td>
                  <td>
                    <Badge bg={getStatusBadge(item.status)}>
                      {item.status}
                    </Badge>
                    {/* Show specific update error below badge */}
                    {updatingStatus === "failed" &&
                      updatingItemId === item.id && (
                        <small className="d-block text-danger mt-1">
                          Error: {updatingError || "Update failed"}
                        </small>
                      )}
                  </td>
                  <td>
                    {/* Inline status update dropdown */}
                    {updatingStatus === "loading" &&
                    updatingItemId === item.id ? (
                      <Spinner
                        animation="border"
                        size="sm"
                        title="Updating..."
                      />
                    ) : (
                      // Disable if Delivered or Cancelled? Optional.
                      <Form.Select
                        size="sm"
                        value={item.status} // Controlled by current item status
                        onChange={(e) => handleStatusChange(e, item.id)}
                        disabled={
                          item.status === "Delivered" ||
                          item.status === "Cancelled"
                        }
                        aria-label={`Update status for shipment ${item.id}`}
                        style={{ minWidth: "120px" }} // Ensure dropdown is wide enough
                      >
                        {/* Add a placeholder only if not final status */}
                        {item.status !== "Delivered" &&
                          item.status !== "Cancelled" && (
                            <option value={item.status} disabled>
                              Change status...
                            </option>
                          )}

                        {shipmentStatuses.map((s) => (
                          <option
                            key={s}
                            value={s}
                            disabled={s === item.status}
                          >
                            {s}
                          </option>
                        ))}
                      </Form.Select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      );
    }
  }

  return (
    <div>
      {/* General updating error not tied to a specific item (if any) */}
      {updatingStatus === "failed" && !updatingItemId && (
        <Alert
          variant="danger"
          onClose={() => dispatch(resetUpdatingStatus())}
          dismissible
        >
          Failed to update status: {updatingError}
        </Alert>
      )}
      {content}
    </div>
  );
};

export default LogisticsList;
