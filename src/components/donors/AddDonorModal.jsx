// src/components/donors/AddDonorModal.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Spinner, Alert, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
// Import the new combined thunk and reset action
import { recordDonationAndUpdateInventory, resetRecordingStatus, clearDonationErrors } from '../../redux/features/donations/donationSlice';
// We might still need addDonor if we decide to separate actions later
// import { addDonor, clearDonorError, resetAddingDonorStatus } from '../../redux/features/donors/donorSlice';
import { fetchDonors } from "../../redux/features/donors/donorSlice";

const AddDonorModal = ({ show, handleClose }) => {
    // Donor States
    const [name, setName] = useState('');
    const [type, setType] = useState('Individual');
    const [contactPerson, setContactPerson] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');

    // Donation States
    const [itemName, setItemName] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');

    // General States
    const [formError, setFormError] = useState('');

    const dispatch = useDispatch();
    // Use the status/error from the donations slice for the combined action
    const { recordingStatus, recordingError } = useSelector((state) => state.donations);

    // Clear form and errors when modal is shown
    useEffect(() => {
        if (show) {
            // Reset donor fields
            setName('');
            setType('Individual');
            setContactPerson('');
            setEmail('');
            setPhone('');
            setAddress('');
            // Reset donation fields
            setItemName('');
            setCategory('');
            setQuantity('');
            // Reset errors/status
            setFormError('');
            dispatch(clearDonationErrors()); // Clear errors from donation slice
            dispatch(resetRecordingStatus()); // Ensure status is idle
        }
    }, [show, dispatch]);

    // Close modal automatically on successful recording
    useEffect(() => {
        if (recordingStatus === 'succeeded' && show) {
            handleClose(); // Close the modal
                        dispatch(fetchDonors());

        }
    }, [recordingStatus, handleClose, show]);

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError('');

        // --- Validation ---
        if (!name.trim()) return setFormError('Donor name is required.');
        if (type === 'Organization' && !contactPerson.trim()) return setFormError('Contact person is required for organizations.');
        if (!itemName.trim()) return setFormError('Donated item name is required.');
        if (!category.trim()) return setFormError('Donated item category is required.');
        const qty = parseInt(quantity, 10);
        if (isNaN(qty) || qty <= 0) return setFormError('Valid donation quantity is required (must be > 0).');
        // Add more specific validation if needed

        // --- Prepare Data ---
        const donorData = {
            // No ID here, indicates a new donor for the thunk
            name: name.trim(),
            type,
            contactPerson: type === 'Organization' ? contactPerson.trim() : '',
            email: email.trim(),
            phone: phone.trim(),
            address: address.trim(),
        };

        const donationData = {
            itemName: itemName.trim(),
            category: category.trim(),
            quantity: qty,
            // donorId and donationDate will be added by the thunk
        };

        // --- Dispatch Combined Action ---
        dispatch(recordDonationAndUpdateInventory({ donorData, donationData }));
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Add New Donor and Initial Donation</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Display Recording error */}
                {recordingError && (
                    <Alert variant="danger">
                        Failed to record donation: {typeof recordingError === 'string' ? recordingError : 'Server error'}
                    </Alert>
                )}
                {/* Display local form validation error */}
                {formError && <Alert variant="warning">{formError}</Alert>}

                <Form onSubmit={handleSubmit}>
                    {/* Donor Information Section */}
                    <h5>Donor Information</h5>
                    <hr />
                    <Row>
                        <Col md={6}>
                             <Form.Group className="mb-3" controlId="formDonorName">
                                <Form.Label>Donor Name*</Form.Label>
                                <Form.Control type="text" placeholder="Full name or organization" value={name} onChange={(e) => setName(e.target.value)} required />
                            </Form.Group>
                        </Col>
                         <Col md={6}>
                            <Form.Group className="mb-3" controlId="formDonorType">
                                <Form.Label>Type*</Form.Label>
                                <Form.Select value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="Individual">Individual</option>
                                    <option value="Organization">Organization</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                     {type === 'Organization' && (
                        <Form.Group className="mb-3" controlId="formContactPerson">
                            <Form.Label>Contact Person*</Form.Label>
                            <Form.Control type="text" placeholder="Contact person's name" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required={type === 'Organization'} />
                        </Form.Group>
                    )}
                    <Row>
                        <Col md={6}>
                           <Form.Group className="mb-3" controlId="formDonorEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Optional" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                        </Col>
                         <Col md={6}>
                            <Form.Group className="mb-3" controlId="formDonorPhone">
                                <Form.Label>Phone</Form.Label>
                                <Form.Control type="tel" placeholder="Optional" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            </Form.Group>
                        </Col>
                    </Row>
                     <Form.Group className="mb-3" controlId="formDonorAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control as="textarea" rows={2} placeholder="Optional" value={address} onChange={(e) => setAddress(e.target.value)} />
                    </Form.Group>

                    {/* Donation Information Section */}
                    <h5 className="mt-4">Initial Donation Information</h5>
                    <hr />
                    <Row>
                         <Col md={6}>
                            <Form.Group className="mb-3" controlId="formItemName">
                                <Form.Label>Item Name*</Form.Label>
                                <Form.Control type="text" placeholder="e.g., Rice Bags (5kg)" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
                            </Form.Group>
                        </Col>
                         <Col md={6}>
                            <Form.Group className="mb-3" controlId="formCategory">
                                <Form.Label>Category*</Form.Label>
                                <Form.Control type="text" placeholder="e.g., Food Grains" value={category} onChange={(e) => setCategory(e.target.value)} required />
                                {/* Consider making this a dropdown based on existing inventory categories */}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3" controlId="formQuantity">
                        <Form.Label>Quantity Donated*</Form.Label>
                        <Form.Control type="number" placeholder="e.g., 50" value={quantity} onChange={(e) => setQuantity(e.target.value)} required min="1" />
                    </Form.Group>

                    {/* Footer Buttons */}
                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="secondary" onClick={handleClose} className="me-2" disabled={recordingStatus === 'loading'}> Cancel </Button>
                        <Button variant="primary" type="submit" disabled={recordingStatus === 'loading'}>
                            {recordingStatus === 'loading' ? (
                                <> <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" /> Recording... </>
                            ) : ( "Record Donor & Donation" )}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AddDonorModal;