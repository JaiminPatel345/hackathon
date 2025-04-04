import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation } from '@/types/chat';

interface ChatState {
  conversations: IConversation[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<IConversation[]>) => {
      state.conversations = action.payload;
      state.loading = false;
      state.error = null;
    },
    addConversation: (state, action: PayloadAction<IConversation>) => {
      state.conversations.push(action.payload);
    },
    removeConversation: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.filter(
        (c) => c._id !== action.payload
      );
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

export const { setConversations, addConversation, removeConversation, setLoading, setError } =
  chatSlice.actions;
export default chatSlice.reducer;
