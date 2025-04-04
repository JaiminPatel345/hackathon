import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  getConversationMessages,
  joinConversation,
  sendMessage
} from '@/api/chat.api';
import {store} from '../store';
import {ICreateConversationRequest, ISendMessageRequest} from "@/types/request";

// Helper function to get token from state
const getTokenFromState = () => {
  const state = store.getState();
  const token = state.auth.token;
  if (!token) throw new Error('Authentication required');
  return token;
};

// Fetch all conversations
export const fetchConversations = createAsyncThunk(
    'chat/fetchConversations',
    async (_) => {
      const token = getTokenFromState();
      return await getAllConversations(token);
    }
);

// Create a new conversation
export const createNewConversation = createAsyncThunk(
    'chat/createConversation',
    async (
        {type, participants, title}: ICreateConversationRequest
    ) => {
      const token = getTokenFromState();
      return await createConversation(token, type, participants, title);
    }
);

// Delete a conversation
export const deleteExistingConversation = createAsyncThunk(
    'chat/deleteConversation',
    async (conversationId: string) => {
      const token = getTokenFromState();
      await deleteConversation(token, conversationId);
      return conversationId;
    }
);

// Join a conversation
export const joinExistingConversation = createAsyncThunk(
    'chat/joinConversation',
    async (conversationId: string) => {
      const token = getTokenFromState();
      const result = await joinConversation(token, conversationId);
      return {conversationId, result};
    }
);

// Add message fetching and sending
export const fetchMessages = createAsyncThunk(
    'chat/fetchMessages',
    async (conversationId: string) => {
      const token = getTokenFromState();
      const messages = await getConversationMessages(token, conversationId);
      return {conversationId, messages};
    }
);

export const sendNewMessage = createAsyncThunk(
    'chat/sendMessage',
    async (
        {conversationId, content, replyTo}: ISendMessageRequest
    ) => {
      const token = getTokenFromState();
      const message = await sendMessage(token, conversationId, content, replyTo);
      return {conversationId, message};
    }
);