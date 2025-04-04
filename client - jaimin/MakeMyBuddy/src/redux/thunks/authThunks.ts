import {createAsyncThunk} from '@reduxjs/toolkit';
import {login, register, verifyOtp} from '@/api/auth.api';
import {setCredentials} from '../slices/authSlice';

export const loginThunk = createAsyncThunk(
    'auth/login',
    async (
        {identifier, password}: { identifier: string; password: string },
        {dispatch, rejectWithValue}
    ) => {
      try {
        const data = await login(identifier, password);
        dispatch(setCredentials({
          token: data.data.token,
          user: data.data.user
        }));
        return data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Login failed');
      }
    }
);

export const registerThunk = createAsyncThunk(
    'auth/register',
    async (
        {name, username, password, mobile}: {
          name: string;
          username: string;
          password: string;
          mobile: string
        },
        {rejectWithValue}
    ) => {
      try {
        const data = await register(name, username, password, mobile);
        return data.data.user;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'Registration failed');
      }
    }
);

export const verifyOtpThunk = createAsyncThunk(
    'auth/verifyOtp',
    async (
        {username, givenOtp}: { username: string; givenOtp: string },
        {dispatch, rejectWithValue}
    ) => {
      try {
        const data = await verifyOtp(username, givenOtp);
        dispatch(setCredentials({
          token: data.data.token,
          user: data.data.user
        }));
        return data.data;
      } catch (error: any) {
        return rejectWithValue(error.response?.data || 'OTP verification failed');
      }
    }
);
