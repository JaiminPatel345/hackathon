import {createAsyncThunk} from '@reduxjs/toolkit';
import {login, register, verifyOtp} from '@/api/auth.api';
import {
  ILoginRequest,
  IRegisterRequest,
  IVerifyOtpRequest
} from "@/types/request";

// Create a base thunk that handles authentication errors
const createAuthThunk = (type: any, apiCall: any) =>
    createAsyncThunk(
        `auth/${type}`,
        async (payload, {rejectWithValue}) => {
          try {
            const response = await apiCall(payload);
            return response.data;
          } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message ||
                error.response?.data ||
                `${type.charAt(0).toUpperCase() + type.slice(1)} failed`
            );
          }
        }
    );

// Login thunk
export const loginUserThunk = createAsyncThunk(
    'auth/login',
    async ({identifier, password}: ILoginRequest, {
      dispatch,
      rejectWithValue
    }) => {
      try {
        const response = await login(identifier, password);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Login failed');
      }
    }
);

// Register thunk
export const registerUserThunk = createAsyncThunk(
    'auth/register',
    async (userData:IRegisterRequest, {rejectWithValue}) => {
      try {
        const {name, username, password, mobile} = userData;
        const response = await register(name, username, password, mobile);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Registration failed');
      }
    }
);

// Verify OTP thunk
export const verifyUserOtpThunk = createAsyncThunk(
    'auth/verifyOtp',
    async ({username, givenOtp}:IVerifyOtpRequest, {dispatch, rejectWithValue}) => {
      try {
        const response = await verifyOtp(username, givenOtp);
        return response.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'OTP verification failed');
      }
    }
);