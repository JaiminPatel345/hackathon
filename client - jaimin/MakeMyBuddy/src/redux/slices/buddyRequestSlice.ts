import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBuddyRequest } from '@/types/buddyRequest';
import {
  fetchBuddyRequestsThunk,
  sendRequestThunk,
  acceptRequestThunk,
  rejectRequestThunk,
  cancelRequestThunk
} from '../thunks/buddyRequestThunks';

interface BuddyRequestState {
  sentRequests: IBuddyRequest[];
  receivedRequests: IBuddyRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: BuddyRequestState = {
  sentRequests: [],
  receivedRequests: [],
  loading: false,
  error: null,
};

const buddyRequestSlice = createSlice({
  name: 'buddyRequests',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all buddy requests
    builder
      .addCase(fetchBuddyRequestsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuddyRequestsThunk.fulfilled, (state, action) => {
        state.sentRequests = action.payload.sent;
        state.receivedRequests = action.payload.received;
        state.loading = false;
      })
      .addCase(fetchBuddyRequestsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buddy requests';
      })

    // Send buddy request
    builder
      .addCase(sendRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRequestThunk.fulfilled, (state, action) => {
        state.sentRequests.push(action.payload);
        state.loading = false;
      })
      .addCase(sendRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send request';
      })

    // Accept buddy request
    builder
      .addCase(acceptRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptRequestThunk.fulfilled, (state, action) => {
        const index = state.receivedRequests.findIndex(req => req._id === action.payload._id);
        if (index !== -1) {
          state.receivedRequests[index].status = 'accepted';
        }
        state.loading = false;
      })
      .addCase(acceptRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to accept request';
      })

    // Reject buddy request
    builder
      .addCase(rejectRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectRequestThunk.fulfilled, (state, action) => {
        state.receivedRequests = state.receivedRequests.filter(
          request => request._id !== action.payload._id
        );
        state.loading = false;
      })
      .addCase(rejectRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reject request';
      })

    // Cancel buddy request
    builder
      .addCase(cancelRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelRequestThunk.fulfilled, (state, action) => {
        state.sentRequests = state.sentRequests.filter(
          request => request._id !== action.payload._id
        );
        state.loading = false;
      })
      .addCase(cancelRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cancel request';
      });
  },
});

export const { clearErrors } = buddyRequestSlice.actions;
export default buddyRequestSlice.reducer;