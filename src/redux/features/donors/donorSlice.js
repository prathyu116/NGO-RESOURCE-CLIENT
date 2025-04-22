// src/redux/features/donors/donorSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define a constant for the API URL
const DONORS_API_URL = 'http://localhost:5001/donors'; // Make sure this matches your json-server port

// --- Async Thunks ---

// Fetch all donors
export const fetchDonors = createAsyncThunk(
    'donors/fetchDonors',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(DONORS_API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch donors');
        }
    }
);

// Add a new donor
export const addDonor = createAsyncThunk(
    'donors/addDonor',
    async (newDonorData, { rejectWithValue }) => {
        try {
            // In real scenarios, ID generation is usually handled by the backend
            // For json-server, it handles it automatically if no ID is sent
            const response = await axios.post(DONORS_API_URL, newDonorData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add donor');
        }
    }
);

// Update an existing donor
export const updateDonor = createAsyncThunk(
    'donors/updateDonor',
    async ({ id, updatedData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`${DONORS_API_URL}/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Update donor error:", error.response);
            return rejectWithValue(error.response?.data || 'Failed to update donor');
        }
    }
);

// Delete a donor
export const deleteDonor = createAsyncThunk(
    'donors/deleteDonor',
    async (donorId, { rejectWithValue }) => {
        try {
            await axios.delete(`${DONORS_API_URL}/${donorId}`);
            return donorId; // Return the ID of the deleted donor for removal from state
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to delete donor');
        }
    }
);

// --- Initial State ---
const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' (for fetching)
    error: null,    // Error message for fetching
    addingStatus: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    addingError: null,
    updatingStatus: 'idle',
    updatingError: null,
    deletingStatus: 'idle',
    deletingError: null,
};

// --- Slice Definition ---
const donorSlice = createSlice({
    name: 'donors',
    initialState,
    reducers: {
        // Action to clear any donor-related errors
        clearDonorError: (state) => {
            state.error = null;
            state.addingError = null;
            state.updatingError = null;
            state.deletingError = null;
        },
        // Action to reset the status after an add operation (e.g., to allow closing modal)
        resetAddingDonorStatus: (state) => {
            state.addingStatus = 'idle';
            state.addingError = null; // Optionally clear error too
        },
        // Action to reset the status after an update operation
        resetUpdatingDonorStatus: (state) => {
            state.updatingStatus = 'idle';
            state.updatingError = null;
        },
        // Action to reset the status after an delete operation (if needed)
        resetDeletingDonorStatus: (state) => {
            state.deletingStatus = 'idle';
            state.deletingError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Donors ---
            .addCase(fetchDonors.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchDonors.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchDonors.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // --- Add Donor ---
            .addCase(addDonor.pending, (state) => {
                state.addingStatus = 'loading';
                state.addingError = null;
            })
            .addCase(addDonor.fulfilled, (state, action) => {
                state.addingStatus = 'succeeded';
                state.items.push(action.payload); // Add the new donor to the list
            })
            .addCase(addDonor.rejected, (state, action) => {
                state.addingStatus = 'failed';
                state.addingError = action.payload;
            })
            // --- Update Donor ---
            .addCase(updateDonor.pending, (state) => {
                state.updatingStatus = 'loading';
                state.updatingError = null;
            })
            .addCase(updateDonor.fulfilled, (state, action) => {
                state.updatingStatus = 'succeeded';
                const index = state.items.findIndex(donor => donor.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Replace with updated donor
                }
            })
            .addCase(updateDonor.rejected, (state, action) => {
                state.updatingStatus = 'failed';
                state.updatingError = action.payload;
            })
            // --- Delete Donor ---
            .addCase(deleteDonor.pending, (state) => {
                state.deletingStatus = 'loading';
                state.deletingError = null;
            })
            .addCase(deleteDonor.fulfilled, (state, action) => {
                state.deletingStatus = 'succeeded';
                state.items = state.items.filter(donor => donor.id !== action.payload); // Remove deleted donor
            })
            .addCase(deleteDonor.rejected, (state, action) => {
                state.deletingStatus = 'failed';
                state.deletingError = action.payload;
            });
    },
});

// --- Export Actions and Reducer ---
export const {
    clearDonorError,
    resetAddingDonorStatus,
    resetUpdatingDonorStatus,
    resetDeletingDonorStatus
} = donorSlice.actions;

export default donorSlice.reducer;