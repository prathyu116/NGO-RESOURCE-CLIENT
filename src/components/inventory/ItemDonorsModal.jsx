import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner, Alert, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios"; // Need axios for direct fetching here
import { Link } from "react-router-dom"; // To link to donor detail pages
import {
  resetItemDonors,
  clearDonationErrors,
} from "../../redux/features/donations/donationSlice"; // Import actions

// API URLs (Consider moving to a config file)
const DONATIONS_API_URL = "https://renderdb-btaz.onrender.com/donations";
const DONORS_API_URL = "https://renderdb-btaz.onrender.com/donors";

const ItemDonorsModal = ({ show, handleClose, item }) => {
  const dispatch = useDispatch();
  // Local state for fetched donor details and loading/error states for this modal
  const [donorDetails, setDonorDetails] = useState({}); // Map donorId -> donor object
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [relevantDonations, setRelevantDonations] = useState([]);

  // Fetch donations for the specific item when the modal is shown or item changes
  useEffect(() => {
    if (show && item) {
      const fetchDonorsForItem = async () => {
        setLoading(true);
        setError(null);
        setRelevantDonations([]);
        setDonorDetails({});
        dispatch(clearDonationErrors()); // Clear any related redux errors

        try {
          // 1. Fetch all donations matching the item name and category
          const donationRes = await axios.get(DONATIONS_API_URL, {
            params: {
              itemName: item.itemName,
              category: item.category,
            },
          });
          const donations = donationRes.data;
          setRelevantDonations(donations); // Store donations for display

          if (donations.length > 0) {
            // 2. Get unique donor IDs from these donations
            const donorIds = [...new Set(donations.map((d) => d.donorId))];

            // 3. Fetch details for each unique donor
            // Warning: This can make many requests (N+1 problem)
            // In a real backend, you'd ideally have an endpoint that returns donations WITH donor details embedded.
            const donorPromises = donorIds.map((id) =>
              axios
                .get(`${DONORS_API_URL}/${id}`)
                .then((res) => res.data)
                .catch((err) => {
                  console.warn(`Failed to fetch donor ${id}`, err);
                  return null; // Handle fetch failure for individual donors
                })
            );

            const fetchedDonors = await Promise.all(donorPromises);
            const detailsMap = {};
            fetchedDonors.forEach((donor) => {
              if (donor) {
                // Check if fetch was successful
                detailsMap[donor.id] = donor;
              }
            });
            setDonorDetails(detailsMap);
          }
        } catch (err) {
          console.error("Error fetching item donors:", err);
          setError(
            err.response?.data?.message ||
              err.message ||
              "Failed to load donor information."
          );
        } finally {
          setLoading(false);
        }
      };

      fetchDonorsForItem();
    } else {
      // Reset state when modal is closed or no item
      setRelevantDonations([]);
      setDonorDetails({});
      setLoading(false);
      setError(null);
      dispatch(resetItemDonors()); // Reset any related Redux state if needed
    }
  }, [show, item, dispatch]);

  if (!item) return null; // Don't render if no item is provided

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Donors for: {item.itemName} ({item.category})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {loading && (
          <div className="text-center">
            <Spinner animation="border" /> <p>Loading donors...</p>
          </div>
        )}
        {error && <Alert variant="danger">{error}</Alert>}

        {!loading &&
          !error &&
          (relevantDonations.length > 0 ? (
            <div className="table-responsive">
              <Table striped bordered hover size="sm">
                <thead className="table-light">
                  <tr>
                    <th>Donation Date</th>
                    <th>Donor Name</th>
                    <th>Quantity Donated</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantDonations.map((donation) => {
                    const donor = donorDetails[donation.donorId];
                    return (
                      <tr key={donation.id}>
                        <td>
                          {new Date(donation.donationDate).toLocaleDateString()}
                        </td>
                        <td>
                          {donor ? (
                            <Link
                              to={`/donors/${donor.id}`}
                              onClick={handleClose}
                            >
                              {" "}
                              {/* Close modal on click */}
                              {donor.name} ({donor.type})
                            </Link>
                          ) : (
                            <span className="text-muted">
                              Donor ID: {donation.donorId} (Details unavailable)
                            </span>
                          )}
                        </td>
                        <td>{donation.quantity}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          ) : (
            <Alert variant="info">
              No specific donation records found for this exact item name and
              category.
            </Alert>
          ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ItemDonorsModal;
