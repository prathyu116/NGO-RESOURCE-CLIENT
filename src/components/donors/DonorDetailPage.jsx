import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  Table,
  Spinner,
  Alert,
  Breadcrumb,
  Row,
  Col,
} from "react-bootstrap";
import {
  FaArrowLeft,
  FaBuilding,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { fetchDonors } from "../redux/features/donors/donorSlice"; // To fetch donor details if needed
import {
  fetchDonations,
  resetDonorHistory,
} from "../redux/features/donations/donationSlice";

const DonorDetailPage = () => {
  const { donorId } = useParams(); // Get donor ID from URL
  const dispatch = useDispatch();

  // --- Selectors ---
  // Find the specific donor from the main donor list (fetch if needed)
  const { items: donors, status: donorStatus } = useSelector(
    (state) => state.donors
  );
  const donor = donors.find((d) => d.id === donorId);

  // Select donation history for this donor
  const { donorHistory, donorHistoryStatus, donorHistoryError } = useSelector(
    (state) => state.donations
  );

  // --- Effects ---
  // Fetch donors if list is empty or specific donor not found
  useEffect(() => {
    if (donorStatus === "idle" || (donorStatus === "succeeded" && !donor)) {
      dispatch(fetchDonors());
    }
  }, [donorStatus, donor, dispatch]);

  // Fetch donation history for this specific donor when donorId changes
  useEffect(() => {
    if (donorId) {
      // Reset previous history before fetching new one
      dispatch(resetDonorHistory());
      // Fetch donations filtered by donorId
      dispatch(fetchDonations({ donorId }));
    }

    // Cleanup function to reset history when component unmounts
    return () => {
      dispatch(resetDonorHistory());
    };
  }, [donorId, dispatch]);

  // --- Render Logic ---
  if (donorStatus === "loading" || (!donor && donorStatus !== "failed")) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" /> <p>Loading donor details...</p>
      </div>
    );
  }

  if (!donor && donorStatus === "succeeded") {
    return (
      <Alert variant="warning">Donor with ID '{donorId}' not found.</Alert>
    );
  }
  if (donorStatus === "failed") {
    return <Alert variant="danger">Error loading donor details.</Alert>;
  }

  return (
    <div>
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/donors" }}>
          Donors
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          {donor?.name || "Donor Details"}
        </Breadcrumb.Item>
      </Breadcrumb>

      <Link to="/donors" className="btn btn-outline-secondary btn-sm mb-3">
        <FaArrowLeft className="me-2" /> Back to Donors List
      </Link>

      {/* Donor Information Card */}
      {donor && (
        <Card className="mb-4">
          <Card.Header as="h4">
            {donor.name}{" "}
            {donor.type === "Organization" ? (
              <FaBuilding title="Organization" />
            ) : (
              <FaUser title="Individual" />
            )}
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p>
                  <strong>Type:</strong> {donor.type}
                </p>
                {donor.contactPerson && (
                  <p>
                    <strong>Contact Person:</strong> {donor.contactPerson}
                  </p>
                )}
                {donor.email && (
                  <p>
                    <FaEnvelope className="me-2" />
                    <strong>Email:</strong>{" "}
                    <a href={`mailto:${donor.email}`}>{donor.email}</a>
                  </p>
                )}
              </Col>
              <Col md={6}>
                {donor.phone && (
                  <p>
                    <FaPhone className="me-2" />
                    <strong>Phone:</strong>{" "}
                    <a href={`tel:${donor.phone}`}>{donor.phone}</a>
                  </p>
                )}
                {donor.address && (
                  <p>
                    <FaMapMarkerAlt className="me-2" />
                    <strong>Address:</strong> {donor.address}
                  </p>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      {/* Donation History Section */}
      <h5>Donation History</h5>
      {donorHistoryStatus === "loading" && (
        <div className="text-center my-3">
          <Spinner animation="border" size="sm" /> Loading history...
        </div>
      )}
      {donorHistoryStatus === "failed" && (
        <Alert variant="danger">
          Error loading donation history: {donorHistoryError}
        </Alert>
      )}
      {donorHistoryStatus === "succeeded" &&
        (donorHistory.length > 0 ? (
          <div className="table-responsive">
            <Table striped bordered hover size="sm">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Date</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Quantity Donated</th>
                </tr>
              </thead>
              <tbody>
                {donorHistory.map((donation, index) => (
                  <tr key={donation.id}>
                    <td>{index + 1}</td>
                    <td>
                      {new Date(donation.donationDate).toLocaleDateString()}
                    </td>
                    <td>{donation.itemName}</td>
                    <td>{donation.category}</td>
                    <td>{donation.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        ) : (
          <Alert variant="info">
            This donor has no recorded donation history yet.
          </Alert>
        ))}
    </div>
  );
};

export default DonorDetailPage;
