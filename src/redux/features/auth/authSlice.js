import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Mock API call for login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            // In a real app, this would be a POST request
            // For json-server, we GET and filter (simplification for demo)
            const response = await axios.get(`https://renderdb-btaz.onrender.com/users?email=${email}&password=${password}`);
            if (response.data.length > 0) {
                const user = response.data[0];
                // Store minimal user data (don't store password!)
                const userData = { id: user.id, email: user.email, name: user.name };
                localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
                return userData;
            } else {
                return rejectWithValue('Invalid email or password');
            }
        } catch (error) {
            console.error("Login error:", error);
            return rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Get user from localStorage if exists
const userFromStorage = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user'))
    : null;

const initialState = {
    user: userFromStorage,
    isAuthenticated: !!userFromStorage, // True if user exists in storage
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('user'); // Clear user from storage
        },
        clearAuthError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = action.payload; // Error message from rejectWithValue
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;