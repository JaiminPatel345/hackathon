import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types/user';
import { loginUser, registerUser, verifyUserOtp } from '../thunks/authThunks';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string | null;
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  registrationSuccess: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  registrationSuccess: false,
};

// Helper function to save auth data
const saveAuthData = async (token: string, user: IUser) => {
  try {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save auth data', error);
  }
};

// Helper function to clear auth data
const clearAuthData = async () => {
  try {
    await AsyncStorage.multiRemove(['token', 'user']);
  } catch (error) {
    console.error('Failed to clear auth data', error);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: IUser }>
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      // Save to AsyncStorage
      saveAuthData(action.payload.token, action.payload.user);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear from AsyncStorage
      clearAuthData();
    },
    clearErrors: (state) => {
      state.error = null;
    },
    initializeFromStorage: (
      state,
      action: PayloadAction<{ token: string; user: IUser }>
    ) => {
      if (action.payload.token && action.payload.user) {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      }
    }
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;

        // Save to AsyncStorage
        saveAuthData(action.payload.token, action.payload.user);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.registrationSuccess = false;
      })

    // Verify OTP
    builder
      .addCase(verifyUserOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserOtp.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;

        // Save to AsyncStorage
        saveAuthData(action.payload.token, action.payload.user);
      })
      .addCase(verifyUserOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, clearErrors, initializeFromStorage } = authSlice.actions;
export const authActions = authSlice.actions;
export default authSlice.reducer;