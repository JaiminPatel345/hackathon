import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  acceptBuddyRequest,
  cancelBuddyRequest,
  getReceivedRequests,
  getSentRequests,
  rejectBuddyRequest,
  sendBuddyRequest
} from '@/api/buddyRequest.api';
import {store} from '../store';

// Helper function to get token from state
const getTokenFromState = () => {
  const state = store.getState();
  const token = state.auth.token;
  if (!token) throw new Error('Authentication required');
  return token;
};

// Fetch all buddy requests (sent and received)
export const fetchBuddyRequests = createAsyncThunk(
    'buddyRequests/fetchAll',
    async (_, {getState}) => {
      const token = getTokenFromState();
      const [sent, received] = await Promise.all([
        getSentRequests(token),
        getReceivedRequests(token)
      ]);

      return {sent, received};
    }
);

// Send a new buddy request
export const sendRequest = createAsyncThunk(
    'buddyRequests/send',
    async ({userId, type}: {
      userId: string;
      type: 'buddy' | 'follower'
    }, {getState}) => {
      const token = getTokenFromState();
      return await sendBuddyRequest(token, userId, type);
    }
);

// Accept a buddy request
export const acceptRequest = createAsyncThunk(
    'buddyRequests/accept',
    async (requestId: string) => {
      const token = getTokenFromState();
      const result = await acceptBuddyRequest(token, requestId);
      return {requestId, result};
    }
);

// Reject a buddy request
export const rejectRequest = createAsyncThunk(
    'buddyRequests/reject',
    async (requestId: string) => {
      const token = getTokenFromState();
      await rejectBuddyRequest(token, requestId);
      return requestId;
    }
);

// Cancel a sent buddy request
export const cancelRequest = createAsyncThunk(
    'buddyRequests/cancel',
    async (requestId: string) => {
      const token = getTokenFromState();
      await cancelBuddyRequest(token, requestId);
      return requestId;
    }
);
