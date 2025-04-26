import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { addInventoryItem, updateInventoryItem, fetchInventory } from '../inventory/inventorySlice';

const DONATIONS_API_URL = 'https://renderdb-btaz.onrender.com/donations';
const INVENTORY_API_URL = 'https://renderdb-btaz.onrender.com/inventory';
const DONORS_API_URL = 'https://renderdb-btaz.onrender.com/donors';

export const fetchDonations = createAsyncThunk(
    'donations/fetchDonations',
    async (filter = {}, { rejectWithValue }) => { 
        try {
            const response = await axios.get(DONATIONS_API_URL, { params: filter });
            
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch donations');
        }
    }
);

export const recordDonationAndUpdateInventory = createAsyncThunk(
    'donations/recordDonationAndUpdateInventory',
    async ({ donorData, donationData }, { dispatch, rejectWithValue, getState }) => {
        let finalDonorId = donorData.id; // Use existing ID if provided

        try {
            if (!finalDonorId) {
                const donorResponse = await axios.post(DONORS_API_URL, donorData);
                finalDonorId = donorResponse.data.id; 
            }

            const donationPayload = {
                ...donationData,
                donorId: finalDonorId, 
                donationDate: new Date().toISOString(), 
            };
            const donationResponse = await axios.post(DONATIONS_API_URL, donationPayload);
            const newDonation = donationResponse.data;

           
            const inventoryResponse = await axios.get(`${INVENTORY_API_URL}?itemName=${encodeURIComponent(donationData.itemName)}&category=${encodeURIComponent(donationData.category)}`);
            const existingItems = inventoryResponse.data;

            if (existingItems.length > 0) {
                const itemToUpdate = existingItems[0];
                const updatedQuantity = itemToUpdate.quantity + donationData.quantity;
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
                })).unwrap();
            }

         
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
               
            })
            .addCase(recordDonationAndUpdateInventory.rejected, (state, action) => {
                state.recordingStatus = 'failed';
                state.recordingError = action.payload;
            });

        
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