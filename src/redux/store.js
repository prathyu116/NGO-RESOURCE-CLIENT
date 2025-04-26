import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import inventoryReducer from './features/inventory/inventorySlice';
import donorReducer from './features/donors/donorSlice';
import donationReducer from './features/donations/donationSlice';
import logisticsReducer from './features/logistics/logisticsSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        inventory: inventoryReducer,
        donors: donorReducer,
        donations: donationReducer,
        logistics: logisticsReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: {
            ignoredActionPaths: ['meta.arg', 'payload.creationDate', 'payload.lastUpdateDate'],
            ignoredPaths: ['logistics.items'],
        },
        immutableCheck: true,
    }),
});