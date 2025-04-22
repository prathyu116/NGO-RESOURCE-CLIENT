// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import inventoryReducer from './features/inventory/inventorySlice';
import donorReducer from './features/donors/donorSlice';
import donationReducer from './features/donations/donationSlice'; // Import the new reducer

export const store = configureStore({
    reducer: {
        auth: authReducer,
        inventory: inventoryReducer,
        donors: donorReducer,
        donations: donationReducer, // Add the donations reducer
    },
    // Enable serializableCheck and immutableCheck middleware for development
    // You might need to configure serializableCheck to ignore certain paths if non-serializable data is necessary (like Date objects, though we use ISO strings)
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            // Ignore these action types, useful if payload contains non-serializable values
            // ignoredActions: ['donations/recordDonationAndUpdateInventory/fulfilled'],
            // Ignore these field paths in all actions
            ignoredActionPaths: ['meta.arg', 'payload.donationDate'], // Ignore Date objects if they sneak in
            // Ignore these paths in the state
            ignoredPaths: ['donations.items'], // Example if items contained Dates
        },
        immutableCheck: true, // Helps catch accidental state mutations
    }),
});