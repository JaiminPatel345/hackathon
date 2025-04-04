import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '@/types/user';
import { loginUserThunk, registerUserThunk, verifyUserOtpThunk } from '../thunks/authThunks';
import { saveAuthData, clearAuthData } from '@/services/authService';

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

      // Save to SecureStore
      saveAuthData(action.payload.token, action.payload.user);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      // Clear from SecureStore
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
      .addCase(loginUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

    // Register
    builder
      .addCase(registerUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.registrationSuccess = false;
      })
      .addCase(registerUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.registrationSuccess = true;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.registrationSuccess = false;
      })

    // Verify OTP
    builder
      .addCase(verifyUserOtpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyUserOtpThunk.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(verifyUserOtpThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCredentials, logout, clearErrors, initializeFromStorage } = authSlice.actions;
export default authSlice.reducer;