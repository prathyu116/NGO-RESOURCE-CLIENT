// src/redux/features/logistics/logisticsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { updateInventoryItem, fetchInventory } from '../inventory/inventorySlice'; // Import inventory action

const LOGISTICS_API_URL = 'https://renderdb-btaz.onrender.com/logistics';
const INVENTORY_API_URL = 'https://renderdb-btaz.onrender.com/inventory';

// --- Async Thunks ---

// Fetch all logistics records
export const fetchLogistics = createAsyncThunk(
    'logistics/fetchLogistics',
    async (_, { rejectWithValue }) => {
        try {
            // Sort by creationDate descending by default
            const response = await axios.get(`${LOGISTICS_API_URL}?_sort=creationDate&_order=desc`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch logistics records');
        }
    }
);

// Create a new shipment and update inventory
export const createShipmentAndUpdateInventory = createAsyncThunk(
    'logistics/createShipmentAndUpdateInventory',
    async ({ destination, inventoryItemId, quantityShipped }, { dispatch, getState, rejectWithValue }) => {
        try {
            // 1. Get the selected inventory item details
            // Ensure inventory is loaded or fetch it if necessary
            let inventoryState = getState().inventory;
            if (inventoryState.status !== 'succeeded') {
                await dispatch(fetchInventory()).unwrap(); // fetch if not loaded
                inventoryState = getState().inventory; // get updated state
            }

            const itemToShip = inventoryState.items.find(item => item.id === inventoryItemId);

            if (!itemToShip) {
                return rejectWithValue(`Inventory item with ID ${inventoryItemId} not found.`);
            }

            // 2. Validate quantity
            if (quantityShipped <= 0) {
                return rejectWithValue('Quantity to ship must be greater than zero.');
            }
            if (quantityShipped > itemToShip.quantity) {
                return rejectWithValue(`Cannot ship ${quantityShipped}. Only ${itemToShip.quantity} of ${itemToShip.itemName} available.`);
            }

            // 3. Prepare new logistics record
            const now = new Date().toISOString();
            const newShipmentData = {
                destination,
                inventoryItemId,
                itemName: itemToShip.itemName, // Denormalize for display
                category: itemToShip.category, // Denormalize for display
                quantityShipped,
                status: 'Pending', // Initial status
                creationDate: now,
                lastUpdateDate: now,
            };

            // 4. POST to create logistics record
            const logisticsResponse = await axios.post(LOGISTICS_API_URL, newShipmentData);
            const createdShipment = logisticsResponse.data;

            // 5. Calculate new inventory quantity and update inventory item
            const newInventoryQuantity = itemToShip.quantity - quantityShipped;
            await dispatch(updateInventoryItem({
                id: inventoryItemId,
                updatedData: { ...itemToShip, quantity: newInventoryQuantity }
            })).unwrap(); // Use unwrap to catch potential errors from the update

            return createdShipment; // Return the successfully created logistics record

        } catch (error) {
            console.error("Create Shipment Error:", error);
            // If error came from unwrap(), it might have a payload
            const message = error?.message || error?.payload || error?.response?.data || 'Failed to create shipment and update inventory';
            return rejectWithValue(message);
        }
    }
);

// Update the status of an existing shipment
export const updateShipmentStatus = createAsyncThunk(
    'logistics/updateShipmentStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const now = new Date().toISOString();
            // Use PATCH to update only specific fields
            const response = await axios.patch(`${LOGISTICS_API_URL}/${id}`, {
                status,
                lastUpdateDate: now,
            });
            return response.data; // Return the updated logistics record
        } catch (error) {
            console.error("Update Shipment Status Error:", error);
            return rejectWithValue(error.response?.data || 'Failed to update shipment status');
        }
    }
);


// --- Initial State ---
const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed' (for fetch)
    error: null,
    creatingStatus: 'idle',
    creatingError: null,
    updatingStatus: 'idle', // Status for status updates
    updatingError: null,
    // Store the ID of the item currently being updated for specific feedback
    updatingItemId: null,
};

// --- Slice Definition ---
const logisticsSlice = createSlice({
    name: 'logistics',
    initialState,
    reducers: {
        clearLogisticsError: (state) => {
            state.error = null;
            state.creatingError = null;
            state.updatingError = null;
        },
        resetCreatingStatus: (state) => {
            state.creatingStatus = 'idle';
            state.creatingError = null;
        },
        resetUpdatingStatus: (state) => {
            state.updatingStatus = 'idle';
            state.updatingError = null;
            state.updatingItemId = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // --- Fetch Logistics ---
            .addCase(fetchLogistics.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(fetchLogistics.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchLogistics.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // --- Create Shipment ---
            .addCase(createShipmentAndUpdateInventory.pending, (state) => {
                state.creatingStatus = 'loading';
                state.creatingError = null;
            })
            .addCase(createShipmentAndUpdateInventory.fulfilled, (state, action) => {
                state.creatingStatus = 'succeeded';
                // Add the new shipment to the beginning of the list for immediate UI update
                state.items.unshift(action.payload);
                // Inventory state is updated via the dispatched updateInventoryItem thunk
            })
            .addCase(createShipmentAndUpdateInventory.rejected, (state, action) => {
                state.creatingStatus = 'failed';
                state.creatingError = action.payload;
            })
            // --- Update Shipment Status ---
            .addCase(updateShipmentStatus.pending, (state, action) => {
                state.updatingStatus = 'loading';
                state.updatingError = null;
                // Store which item is being updated
                state.updatingItemId = action.meta.arg.id;
            })
            .addCase(updateShipmentStatus.fulfilled, (state, action) => {
                state.updatingStatus = 'idle'; // Reset on success
                state.updatingItemId = null;
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Replace with updated item
                }
            })
            .addCase(updateShipmentStatus.rejected, (state, action) => {
                state.updatingStatus = 'failed';
                state.updatingError = action.payload;
                state.updatingItemId = action.meta.arg.id; // Keep ID on failure
            });
    },
});

// --- Export Actions and Reducer ---
export const {
    clearLogisticsError,
    resetCreatingStatus,
    resetUpdatingStatus
} = logisticsSlice.actions;

export default logisticsSlice.reducer;