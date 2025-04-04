import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IBuddyRequest } from '@/types/buddyRequest';

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
    setSentRequests: (state, action: PayloadAction<IBuddyRequest[]>) => {
      state.sentRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    setReceivedRequests: (state, action: PayloadAction<IBuddyRequest[]>) => {
      state.receivedRequests = action.payload;
      state.loading = false;
      state.error = null;
    },
    addSentRequest: (state, action: PayloadAction<IBuddyRequest>) => {
      state.sentRequests.push(action.payload);
    },
    updateRequest: (state, action: PayloadAction<IBuddyRequest>) => {
      const indexSent = state.sentRequests.findIndex((r) => r._id === action.payload._id);
      const indexReceived = state.receivedRequests.findIndex(
        (r) => r._id === action.payload._id
      );
      if (indexSent !== -1) state.sentRequests[indexSent] = action.payload;
      if (indexReceived !== -1) state.receivedRequests[indexReceived] = action.payload;
    },
    setLoading: (state) => {
      state.loading = true;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { setSentRequests, setReceivedRequests, addSentRequest, updateRequest, setLoading, setError } =
  buddyRequestSlice.actions;
export default buddyRequestSlice.reducer;
