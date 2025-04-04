import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  joinConversation
} from '@/api/chat.api';
import {
  addConversation,
  removeConversation,
  setConversations,
  setError,
  setLoading
} from '../slices/chatSlice';

export const fetchConversationsThunk = createAsyncThunk(
    'chat/fetchConversations',
    async (_, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      dispatch(setLoading());
      try {
        const conversations = await getAllConversations(token);
        dispatch(setConversations(conversations));
        return conversations;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const createConversationThunk = createAsyncThunk(
    'chat/createConversation',
    async (
        {type, participants, title}: {
          type: 'personal' | 'community';
          participants?: string[];
          title?: string
        },
        {getState, dispatch}
    ) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        const conversation = await createConversation(token, type, participants, title);
        dispatch(addConversation(conversation));
        return conversation;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const deleteConversationThunk = createAsyncThunk(
    'chat/deleteConversation',
    async (conversationId: string, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        await deleteConversation(token, conversationId);
        dispatch(removeConversation(conversationId));
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const joinConversationThunk = createAsyncThunk(
    'chat/joinConversation',
    async (conversationId: string, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        await joinConversation(token, conversationId);
        dispatch(fetchConversationsThunk()); // Refresh conversations
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);