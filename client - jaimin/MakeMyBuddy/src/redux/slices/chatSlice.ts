import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation, IMessage } from '@/types/chat';
import {
  fetchConversationsThunk,
  createNewConversationThunk,
  deleteExistingConversationThunk,
  joinExistingConversationThunk,
  fetchMessagesThunk,
  sendNewMessageThunk
} from '../thunks/chatThunks';

interface ChatState {
  conversations: IConversation[];
  messages: Record<string, IMessage[]>;
  activeConversationId: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setActiveConversation: (state, action: PayloadAction<string>) => {
      state.activeConversationId = action.payload;
    },
    clearErrors: (state) => {
      state.error = null;
    },
    addMessageToConversation: (
      state,
      action: PayloadAction<{ conversationId: string, message: IMessage }>
    ) => {
      const { conversationId, message } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(message);
    }
  },
  extraReducers: (builder) => {
    // Fetch conversations
    builder
      .addCase(fetchConversationsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchConversationsThunk.fulfilled, (state, action) => {
        state.conversations = action.payload;
        state.loading = false;
      })
      .addCase(fetchConversationsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch conversations';
      })

    // Create conversation
    builder
      .addCase(createNewConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewConversationThunk.fulfilled, (state, action) => {
        state.conversations.push(action.payload);
        state.loading = false;
        // Set as active conversation
        state.activeConversationId = action.payload._id;
      })
      .addCase(createNewConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create conversation';
      })

    // Delete conversation
    builder
      .addCase(deleteExistingConversationThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteExistingConversationThunk.fulfilled, (state, action) => {
        state.conversations = state.conversations.filter(
          convo => convo._id !== action.payload
        );
        // Clear messages for this conversation
        if (state.messages[action.payload]) {
          delete state.messages[action.payload];
        }
        // Reset active conversation if it was deleted
        if (state.activeConversationId === action.payload) {
          state.activeConversationId = null;
        }
        state.loading = false;
      })
      .addCase(deleteExistingConversationThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete conversation';
      })

    // Join conversation
    builder
      .addCase(joinExistingConversationThunk.fulfilled, (state, action) => {
        const index = state.conversations.findIndex(
          c => c._id === action.payload
        );

      })

    // Fetch messages
    builder
      .addCase(fetchMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesThunk.fulfilled, (state, action) => {
        const { conversationId, messages } = action.payload;
        state.messages[conversationId] = messages;
        state.loading = false;
      })
      .addCase(fetchMessagesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch messages';
      })

    // Send message
    builder
      .addCase(sendNewMessageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendNewMessageThunk.fulfilled, (state, action) => {
        const { conversationId, message } = action.payload;
        if (!state.messages[conversationId]) {
          state.messages[conversationId] = [];
        }
        state.messages[conversationId].push(message);
        state.loading = false;
      })
      .addCase(sendNewMessageThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to send message';
      });
  },
});

export const { setActiveConversation, clearErrors, addMessageToConversation } = chatSlice.actions;
export default chatSlice.reducer;