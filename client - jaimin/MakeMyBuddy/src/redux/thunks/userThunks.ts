import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateProfile } from '@/api/user.api';
import { UpdateProfileRequest } from '@/types/user';
import { RootState } from '../store';

export const updateProfileThunk = createAsyncThunk(
  'user/updateProfile',
  async (profileData: UpdateProfileRequest, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const token = state.auth.token;
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }
      
      const updatedUser = await updateProfile(token, profileData);
      return updatedUser;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.response?.data || 
        'Profile update failed'
      );
    }
  }
); 