import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'customer' | 'seller' | 'admin' | 'drone_operator';
  avatar?: string;
  isEmailVerified: boolean;
  customerProfile?: {
    favoriteRestaurants: string[];
    loyaltyPoints: number;
    totalOrders: number;
    totalSpent: number;
  };
  sellerProfile?: {
    restaurant: string;
    verificationStatus: string;
    rating: number;
    totalEarnings: number;
  };
  adminProfile?: {
    permissions: string[];
    assignedDrones: string[];
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,
  isAuthenticated: false,
};

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    role: string;
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        toast.success('Registration successful! Welcome to DroneDelivery!');
        return response.data.data;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.data.token);
        toast.success(`Welcome back, ${response.data.data.user.firstName}!`);
        return response.data.data;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      if (!token) {
        return rejectWithValue('No token found');
      }

      const response = await axios.get(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        return response.data.data.user;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get user data';
      localStorage.removeItem('token');
      return rejectWithValue(message);
    }
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (profileData: Partial<User>, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Profile updated successfully!');
        return response.data.data.user;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (passwordData: { currentPassword: string; newPassword: string }, { rejectWithValue, getState }) => {
    try {
      const token = (getState() as any).auth.token;
      const response = await axios.put(`${API_URL}/auth/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        toast.success('Password changed successfully!');
        return response.data.message;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password change failed';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
      
      if (response.data.success) {
        toast.success('Password reset link sent to your email!');
        return response.data.message;
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      toast.success('Logged out successfully!');
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.token = null;
      })
      
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Change Password
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      
      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;