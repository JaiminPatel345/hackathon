import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  acceptBuddyRequest,
  cancelBuddyRequest,
  getReceivedRequests,
  getSentRequests,
  rejectBuddyRequest,
  sendBuddyRequest
} from '../../api/buddyRequest.api';
import {
  addSentRequest,
  setError,
  setLoading,
  setReceivedRequests,
  setSentRequests
} from '@/redux/slices/buddyRequestSlice';

export const fetchSentRequestsThunk = createAsyncThunk(
    'buddyRequests/fetchSent',
    async (_, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      dispatch(setLoading());
      try {
        const requests = await getSentRequests(token);
        dispatch(setSentRequests(requests));
        return requests;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const fetchReceivedRequestsThunk = createAsyncThunk(
    'buddyRequests/fetchReceived',
    async (_, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      dispatch(setLoading());
      try {
        const requests = await getReceivedRequests(token);
        dispatch(setReceivedRequests(requests));
        return requests;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const sendBuddyRequestThunk = createAsyncThunk(
    'buddyRequests/send',
    async (
        {userId, type}: { userId: string; type: 'buddy' | 'follower' },
        {getState, dispatch}
    ) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        const request = await sendBuddyRequest(token, userId, type);
        dispatch(addSentRequest(request));
        return request;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const acceptBuddyRequestThunk = createAsyncThunk(
    'buddyRequests/accept',
    async (requestId: string, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        await acceptBuddyRequest(token, requestId);
        dispatch(fetchReceivedRequestsThunk()); // Refresh requests
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const rejectBuddyRequestThunk = createAsyncThunk(
    'buddyRequests/reject',
    async (requestId: string, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        await rejectBuddyRequest(token, requestId);
        dispatch(fetchReceivedRequestsThunk()); // Refresh requests
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const cancelBuddyRequestThunk = createAsyncThunk(
    'buddyRequests/cancel',
    async (requestId: string, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        await cancelBuddyRequest(token, requestId);
        dispatch(fetchSentRequestsThunk()); // Refresh requests
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);