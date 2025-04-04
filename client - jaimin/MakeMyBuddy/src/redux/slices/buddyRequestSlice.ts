import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBuddyRequest } from '@/types/buddyRequest';
import {
  fetchBuddyRequests,
  sendRequest,
  acceptRequest,
  rejectRequest,
  cancelRequest
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
      .addCase(fetchBuddyRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuddyRequests.fulfilled, (state, action) => {
        state.sentRequests = action.payload.sent;
        state.receivedRequests = action.payload.received;
        state.loading = false;
      })
      .addCase(fetchBuddyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch buddy requests';
      })

    // Send buddy request
    builder
      .addCase(sendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendRequest.fulfilled, (state, action) => {
        state.sentRequests.push(action.payload);
        state.loading = false;
      })
      .addCase(sendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send request';
      })

    // Accept buddy request
    builder
      .addCase(acceptRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        const index = state.receivedRequests.findIndex(req => req._id === action.payload.requestId);
        if (index !== -1) {
          state.receivedRequests[index].status = 'accepted';
        }
        state.loading = false;
      })
      .addCase(acceptRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to accept request';
      })

    // Reject buddy request
    builder
      .addCase(rejectRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        state.receivedRequests = state.receivedRequests.filter(
          request => request._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(rejectRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to reject request';
      })

    // Cancel buddy request
    builder
      .addCase(cancelRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelRequest.fulfilled, (state, action) => {
        state.sentRequests = state.sentRequests.filter(
          request => request._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(cancelRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to cancel request';
      });
  },
});

export const { clearErrors } = buddyRequestSlice.actions;
export default buddyRequestSlice.reducer;