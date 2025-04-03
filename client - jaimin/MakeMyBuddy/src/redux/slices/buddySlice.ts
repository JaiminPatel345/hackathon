import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '@/api/axiosInstance';
import { User } from '@/types/user';

interface BuddyState {
  currentBuddy: User | null;
  buddySuggestions: User[];
  loading: boolean;
  error: string | null;
}

const initialState: BuddyState = {
  currentBuddy: null,
  buddySuggestions: [],
  loading: false,
  error: null,
};

export const fetchBuddySuggestions = createAsyncThunk(
  'buddy/fetchSuggestions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/buddy/suggestions');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch buddy suggestions');
    }
  }
);

export const sendBuddyRequest = createAsyncThunk(
  'buddy/sendRequest',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/buddy/request/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send buddy request');
    }
  }
);

export const acceptBuddyRequest = createAsyncThunk(
  'buddy/acceptRequest',
  async (requestId: string, { rejectWithValue }) => {
    try {
      const response = await api.put(`/buddy/request/${requestId}/accept`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept buddy request');
    }
  }
);

export const fetchCurrentBuddy = createAsyncThunk(
  'buddy/fetchCurrent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/buddy/current');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch current buddy');
    }
  }
);

const buddySlice = createSlice({
  name: 'buddy',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuddySuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuddySuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.buddySuggestions = action.payload;
      })
      .addCase(fetchBuddySuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentBuddy.fulfilled, (state, action) => {
        state.currentBuddy = action.payload;
      })
      .addCase(acceptBuddyRequest.fulfilled, (state, action) => {
        state.currentBuddy = action.payload.buddy;
      });
  },
});

export default buddySlice.reducer;