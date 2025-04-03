// src/api/chat.api.ts
import axiosInstance from './axiosInstance';
import { Message } from '../types/chat';

export const getMessages = async (recipientId: string) => {
  const response = await axiosInstance.get(`/chat/messages/${recipientId}`);
  return response.data;
};

export const sendMessage = async (recipientId: string, content: string) => {
  const response = await axiosInstance.post('/chat/send', {
    recipientId,
    content
  });
  return response.data;
};

export const getCommunityMessages = async (communityId: string) => {
  const response = await axiosInstance.get(`/chat/community/${communityId}`);
  return response.data;
};

export const sendCommunityMessage = async (communityId: string, content: string) => {
  const response = await axiosInstance.post('/chat/community/send', {
    communityId,
    content
  });
  return response.data;
};

export const getChats = async () => {
  const response = await axiosInstance.get('/chat/list');
  return response.data;
};