import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  getConversationMessages,
  joinConversation,
  sendMessage
} from '@/api/chat.api';
import {ICreateConversationRequest, ISendMessageRequest} from "@/types/request";

// Fetch all conversations
export const fetchConversationsThunk = createAsyncThunk(
    'chat/fetchConversations',
    async () => {
      return await getAllConversations();
    }
);

// Create a new conversation
export const createNewConversationThunk = createAsyncThunk(
    'chat/createConversation',
    async ({type, participants, title}: ICreateConversationRequest) => {
      return await createConversation(type, participants, title);
    }
);

// Delete a conversation
export const deleteExistingConversationThunk = createAsyncThunk(
    'chat/deleteConversation',
    async (conversationId: string, { getState }) => {
      const token = (getState() as any).auth.token;
      await deleteConversation(token, conversationId);
      return conversationId;
    }
);

// Join an existing conversation
export const joinExistingConversationThunk = createAsyncThunk(
    'chat/joinConversation',
    async (conversationId: string, { getState }) => {
      const token = (getState() as any).auth.token;
      await joinConversation(token, conversationId);
      return conversationId;
    }
);

// Fetch messages for a conversation
export const fetchMessagesThunk = createAsyncThunk(
    'chat/fetchMessages',
    async (conversationId: string, { getState }) => {
      const token = (getState() as any).auth.token;
      const messages = await getConversationMessages(token, conversationId);
      return {conversationId, messages};
    }
);

// Send a new message
export const sendNewMessageThunk = createAsyncThunk(
    'chat/sendMessage',
    async ({conversationId, content, replyTo}: ISendMessageRequest) => {
      // Handle optional replyTo parameter
      const message = replyTo 
        ? await sendMessage(conversationId, content, replyTo)
        : await sendMessage(conversationId, content);
      return {conversationId, message};
    }
);