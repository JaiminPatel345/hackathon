import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  acceptBuddyRequest,
  cancelBuddyRequest,
  getReceivedRequests,
  getSentRequests,
  rejectBuddyRequest,
  sendBuddyRequest
} from '@/api/buddyRequest.api';

// Fetch buddy requests (both sent and received)
export const fetchBuddyRequestsThunk = createAsyncThunk(
    'buddyRequests/fetchAll',
    async () => {
      const [sent, received] = await Promise.all([
        getSentRequests(),
        getReceivedRequests()
      ]);
      return {sent, received};
    }
);

// Send buddy request
export const sendRequestThunk = createAsyncThunk(
    'buddyRequests/send',
    async ({recipientId, type, message}: {
      recipientId: string;
      type: string;
      message?: string;
    }) => {
      return await sendBuddyRequest(recipientId, type, message);
    }
);

// Accept buddy request
export const acceptRequestThunk = createAsyncThunk(
    'buddyRequests/accept',
    async (requestId: string) => {
      return await acceptBuddyRequest(requestId);
    }
);

// Reject buddy request
export const rejectRequestThunk = createAsyncThunk(
    'buddyRequests/reject',
    async (requestId: string) => {
      return await rejectBuddyRequest(requestId);
    }
);

// Cancel buddy request
export const cancelRequestThunk = createAsyncThunk(
    'buddyRequests/cancel',
    async (requestId: string) => {
      return await cancelBuddyRequest(requestId);
    }
);
