// src/api/user.api.ts
import axiosInstance from './axiosInstance';
import { User, Goal } from '../types/user';

export const loginUser = async (email: string, password: string) => {
  const response = await axiosInstance.post('/auth/login', { email, password });
  return response.data;
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await axiosInstance.post('/auth/register', userData);
  return response.data;
};

export const getUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile');
  return response.data;
};

export const updateUserProfile = async (userData: Partial<User>) => {
  const response = await axiosInstance.put('/user/profile', userData);
  return response.data;
};

export const setUserGoal = async (goal: Goal) => {
  const response = await axiosInstance.post('/user/goal', goal);
  return response.data;
};

export const getBuddySuggestions = async () => {
  const response = await axiosInstance.get('/user/buddy-suggestions');
  return response.data;
};

export const requestBuddy = async (userId: string) => {
  const response = await axiosInstance.post(`/buddy/request/${userId}`);
  return response.data;
};

export const acceptBuddyRequest = async (requestId: string) => {
  const response = await axiosInstance.post(`/buddy/accept/${requestId}`);
  return response.data;
};

export const rejectBuddyRequest = async (requestId: string) => {
  const response = await axiosInstance.post(`/buddy/reject/${requestId}`);
  return response.data;
};

export const removeBuddy = async () => {
  const response = await axiosInstance.delete('/buddy');
  return response.data;
};

export const getBlockedUsers = async () => {
  const response = await axiosInstance.get('/user/blocked');
  return response.data;
};

export const blockUser = async (userId: string) => {
  const response = await axiosInstance.post(`/user/block/${userId}`);
  return response.data;
};

export const unblockUser = async (userId: string) => {
  const response = await axiosInstance.delete(`/user/block/${userId}`);
  return response.data;
};

export const getPreviousBuddies = async () => {
  const response = await axiosInstance.get('/user/previous-buddies');
  return response.data;
};