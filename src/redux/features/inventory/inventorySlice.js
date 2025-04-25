// src/redux/features/inventory/inventorySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'https://renderdb-btaz.onrender.com/inventory';
const API_URL_DELETE = 'https://renderdb-btaz.onrender.com/delete-item'; 

// Async Thunks
export const fetchInventory = createAsyncThunk(
    'inventory/fetchInventory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch inventory');
        }
    }
);

export const addInventoryItem = createAsyncThunk(
    'inventory/addInventoryItem',
    async (newItem, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, newItem);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add item');
        }
    }
);

export const deleteInventoryItem = createAsyncThunk(
    'inventory/deleteInventoryItem',
    async (itemId, { rejectWithValue }) => {
        console.log("Deleting item with ID:", typeof itemId);
        try {
            await axios.delete("https://renderdb-btaz.onrender.com/inventory/"+itemId); 
            return itemId;
        } catch (error) {
            if(error.response.status === 500) {
                return itemId;
            }
            return rejectWithValue(error.response?.data || 'Failed to delete item');
        }
    }
);

export const updateInventoryItem = createAsyncThunk(
    'inventory/updateInventoryItem',
    async ({ id, updatedData }, { rejectWithValue }) => {
        console.log("Deleting item with ID:", typeof id);

        try {
            const response = await axios.put(`${API_URL}/${id}`, updatedData);
            return response.data;
        } catch (error) {
            console.error("Update error:", error.response);
            return rejectWithValue(error.response?.data || 'Failed to update item');
        }
    }
);

const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    addingStatus: 'idle',
    addingError: null,
    deletingStatus: 'idle',
    deletingError: null,
    updatingStatus: 'idle',
    updatingError: null,
};

const inventorySlice = createSlice({
    name: 'inventory',
    initialState,
    reducers: {
        clearInventoryError: (state) => {
            state.error = null;
            state.addingError = null;
            state.deletingError = null;
            state.updatingError = null;
        },
        // Reducer to reset adding status
        resetAddingStatus: (state) => {
            state.addingStatus = 'idle';
            state.addingError = null;
        },
        // Reducer to reset updating status
        resetUpdatingStatus: (state) => {
            state.updatingStatus = 'idle';
            state.updatingError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Inventory
            .addCase(fetchInventory.pending, (state) => {
                state.status = 'loading';
                state.error = null; // Clear previous error
            })
            .addCase(fetchInventory.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchInventory.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add Inventory Item
            .addCase(addInventoryItem.pending, (state) => {
                state.addingStatus = 'loading';
                state.addingError = null;
            })
            .addCase(addInventoryItem.fulfilled, (state, action) => {
                state.addingStatus = 'succeeded';
                state.items.push(action.payload);
            })
            .addCase(addInventoryItem.rejected, (state, action) => {
                state.addingStatus = 'failed';
                state.addingError = action.payload;
            })
            // Delete Inventory Item
            .addCase(deleteInventoryItem.pending, (state) => {
                state.deletingStatus = 'loading';
                state.deletingError = null;
            })
            .addCase(deleteInventoryItem.fulfilled, (state, action) => {
                state.deletingStatus = 'succeeded';
                state.items = state.items.filter(item => item.id !== action.payload);
            })
            .addCase(deleteInventoryItem.rejected, (state, action) => {
                state.deletingStatus = 'failed';
                state.deletingError = action.payload;
            })
            // Update Inventory Item
            .addCase(updateInventoryItem.pending, (state) => {
                state.updatingStatus = 'loading';
                state.updatingError = null;
            })
            .addCase(updateInventoryItem.fulfilled, (state, action) => {
                state.updatingStatus = 'succeeded';
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateInventoryItem.rejected, (state, action) => {
                state.updatingStatus = 'failed';
                state.updatingError = action.payload;
            });
    },
});

// Make sure ALL necessary actions are exported here
export const {
    clearInventoryError,
    resetAddingStatus,  // <-- Check this
    resetUpdatingStatus // <-- And this
} = inventorySlice.actions;

export default inventorySlice.reducer;