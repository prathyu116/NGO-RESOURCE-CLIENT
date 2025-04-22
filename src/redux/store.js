// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import inventoryReducer from './features/inventory/inventorySlice';
import donorReducer from './features/donors/donorSlice';
import donationReducer from './features/donations/donationSlice';
import logisticsReducer from './features/logistics/logisticsSlice'; // Import the new reducer

export const store = configureStore({
    reducer: {
        auth: authReducer,
        inventory: inventoryReducer,
        donors: donorReducer,
        donations: donationReducer,
        logistics: logisticsReducer, // Add the logistics reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['meta.arg', 'payload.creationDate', 'payload.lastUpdateDate'], // Ignore Date objects if they sneak in payload
            ignoredPaths: ['logistics.items'], // Might contain dates from server
        },
        immutableCheck: true,
    }),
});