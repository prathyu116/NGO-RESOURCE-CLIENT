// src/redux/features/donations/donationSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addInventoryItem, updateInventoryItem, fetchInventory } from '../inventory/inventorySlice'; // Import inventory actions

const DONATIONS_API_URL = 'http://localhost:5001/donations';
const INVENTORY_API_URL = 'http://localhost:5001/inventory';
const DONORS_API_URL = 'http://localhost:5001/donors';

// --- Async Thunks ---

// Fetch donations (can be filtered later, e.g., by donorId)
export const fetchDonations = createAsyncThunk(
    'donations/fetchDonations',
    async (filter = {}, { rejectWithValue }) => { // filter = { donorId: '...', itemName: '...' }
        try {
            const response = await axios.get(DONATIONS_API_URL, { params: filter });
            // Fetch associated donor details for each donation if needed elsewhere
            // For simplicity here, we just return donations. Details fetched on demand.
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch donations');
        }
    }
);

// Combined action: Add Donor (optional), Add Donation, Update Inventory
export const recordDonationAndUpdateInventory = createAsyncThunk(
    'donations/recordDonationAndUpdateInventory',
    async ({ donorData, donationData }, { dispatch, rejectWithValue, getState }) => {
        let finalDonorId = donorData.id; // Use existing ID if provided

        try {
            // Step 1: Add Donor if it's a new one (no ID provided)
            if (!finalDonorId) {
                const donorResponse = await axios.post(DONORS_API_URL, donorData);
                finalDonorId = donorResponse.data.id; // Get the ID of the newly created donor
                // Dispatch donor add success to update donor state immediately (optional but good UI)
                // Consider creating an action in donorSlice like `donorAddedSuccessfully`
                // Or rely on a subsequent fetchDonors() call
            }

            // Step 2: Add Donation Record
            const donationPayload = {
                ...donationData,
                donorId: finalDonorId, // Link to the correct donor
                donationDate: new Date().toISOString(), // Record donation time
            };
            const donationResponse = await axios.post(DONATIONS_API_URL, donationPayload);
            const newDonation = donationResponse.data;

            // Step 3: Update Inventory
            // Fetch current inventory state to check if item exists
            // We use getState() here to avoid an extra fetch if inventory is loaded,
            // but fetching ensures we have the *absolute* latest before update.
            // Let's fetch for safety with json-server.
            const inventoryResponse = await axios.get(`${INVENTORY_API_URL}?itemName=${encodeURIComponent(donationData.itemName)}&category=${encodeURIComponent(donationData.category)}`);
            const existingItems = inventoryResponse.data;

            if (existingItems.length > 0) {
                // Item exists, update its quantity
                const itemToUpdate = existingItems[0];
                const updatedQuantity = itemToUpdate.quantity + donationData.quantity;
                // Dispatch updateInventoryItem thunk
                await dispatch(updateInventoryItem({
                    id: itemToUpdate.id,
                    updatedData: { ...itemToUpdate, quantity: updatedQuantity }
                })).unwrap(); // unwrap() throws error on rejection
            } else {
                // Item does not exist, add it
                await dispatch(addInventoryItem({
                    itemName: donationData.itemName,
                    category: donationData.category,
                    quantity: donationData.quantity,
                    // NOTE: json-server auto-adds ID. Real backend might need specific handling.
                })).unwrap();
            }

            // Return the newly created donation record
            // We can return both donorId and newDonation if needed
            return { donorId: finalDonorId, donation: newDonation };

        } catch (error) {
            console.error("Record Donation Error:", error);
            // Handle potential errors from dispatching other thunks
            const errorMessage = error?.message || error?.response?.data || 'Failed to record donation and update inventory';
            return rejectWithValue(errorMessage);
        }
    }
);

// --- Initial State ---
const initialState = {
    items: [], // Holds fetched donations, potentially filtered
    status: 'idle', // Status for fetching donations list
    error: null,
    // Status/Error for the combined 'record' action
    recordingStatus: 'idle',
    recordingError: null,
    // State for donor detail page donations
    donorHistory: [],
    donorHistoryStatus: 'idle',
    donorHistoryError: null,
    // State for item donors modal
    itemDonors: [], // Will contain { donor: {...}, quantity: X }
    itemDonorsStatus: 'idle',
    itemDonorsError: null,

};

// --- Slice Definition ---
const donationSlice = createSlice({
    name: 'donations',
    initialState,
    reducers: {
        clearDonationErrors: (state) => {
            state.error = null;
            state.recordingError = null;
            state.donorHistoryError = null;
            state.itemDonorsError = null;
        },
        resetRecordingStatus: (state) => {
            state.recordingStatus = 'idle';
            state.recordingError = null;
        },
        resetDonorHistory: (state) => {
            state.donorHistory = [];
            state.donorHistoryStatus = 'idle';
            state.donorHistoryError = null;
        },
        resetItemDonors: (state) => {
            state.itemDonors = [];
            state.itemDonorsStatus = 'idle';
            state.itemDonorsError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Handle fetchDonations Thunk (Covers both general list and donor history) ---
            .addCase(fetchDonations.pending, (state, action) => {
                // Check if the thunk was called with a donorId argument
                if (action.meta.arg?.donorId) {
                    state.donorHistoryStatus = 'loading';
                    state.donorHistoryError = null; // Clear previous history error
                } else {
                    // Assume it's for the general list otherwise
                    state.status = 'loading';
                    state.error = null; // Clear previous general error
                }
            })
            .addCase(fetchDonations.fulfilled, (state, action) => {
                // Check if the thunk was called with a donorId argument
                if (action.meta.arg?.donorId) {
                    state.donorHistoryStatus = 'succeeded';
                    state.donorHistory = action.payload; // Update donorHistory state
                } else {
                    // Assume it's for the general list otherwise
                    state.status = 'succeeded';
                    state.items = action.payload; // Update general items state
                }
            })
            .addCase(fetchDonations.rejected, (state, action) => {
                // Check if the thunk was called with a donorId argument
                if (action.meta.arg?.donorId) {
                    state.donorHistoryStatus = 'failed';
                    state.donorHistoryError = action.payload; // Update history error
                } else {
                    // Assume it's for the general list otherwise
                    state.status = 'failed';
                    state.error = action.payload; // Update general error
                }
            })

            // --- Record Donation and Update Inventory ---
            .addCase(recordDonationAndUpdateInventory.pending, (state) => {
                state.recordingStatus = 'loading';
                state.recordingError = null;
            })
            .addCase(recordDonationAndUpdateInventory.fulfilled, (state, action) => {
                state.recordingStatus = 'succeeded';
                // Optionally update local state if needed, but often re-fetching
                // donors/inventory lists after success is simpler.
                // Example: state.items.push(action.payload.donation); // If 'items' should reflect ALL donations
            })
            .addCase(recordDonationAndUpdateInventory.rejected, (state, action) => {
                state.recordingStatus = 'failed';
                state.recordingError = action.payload;
            });

        // --- Add cases for other thunks if you create them (e.g., fetchItemDonorsDetails) ---
        // Example placeholder:
        // .addCase(fetchItemDonorsDetails.pending, (state) => { state.itemDonorsStatus = 'loading'; })
        // .addCase(fetchItemDonorsDetails.fulfilled, (state, action) => { /* update itemDonors state */ })
        // .addCase(fetchItemDonorsDetails.rejected, (state, action) => { /* update itemDonorsError */ });
    },
});

// --- Export Actions and Reducer ---
export const {
    clearDonationErrors,
    resetRecordingStatus,
    resetDonorHistory,
    resetItemDonors
} = donationSlice.actions;

export default donationSlice.reducer;