import {axiosInstance} from '@/api/axiosInstance';
import {IConversation} from '@/types/chat';

export const createConversation = async (
    type: 'personal' | 'community',
    participants?: string[],
    title?: string
): Promise<IConversation> => {
  const response = await axiosInstance.post(
      '/chat/conversation',
      {type, participants, title}
  );
  return response.data.data;
};

export const getAllConversations = async (): Promise<IConversation[]> => {
  const response = await axiosInstance.get('/chat/conversation');
  return response.data.data;
};

export const getConversation = async (
    token: string,
    conversationId: string
): Promise<IConversation> => {
  const response = await axiosInstance.get(`/chat/conversation/${conversationId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.data.conversation;
};

export const deleteConversation = async (token: string, conversationId: string): Promise<void> => {
  await axiosInstance.delete(`/chat/conversation/${conversationId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const joinConversation = async (token: string, conversationId: string): Promise<void> => {
  await axiosInstance.post(`/chat/conversation/join/${conversationId}`, {}, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getConversationMessages = async (
    token: string,
    conversationId: string
): Promise<any> => {
  const response = await axiosInstance.get(`/chat/message/${conversationId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.data;
};

export const sendMessage = async (
    conversationId: string,
    content: string,
    replyTo?: string,
): Promise<any> => {
  const response = await axiosInstance.post(
      `/chat/message`,
      {conversationId, content, replyTo}
  );
  return response.data.data;
}