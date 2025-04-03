// src/api/task.api.ts
import axiosInstance from './axiosInstance';
import { Task } from '../types/task';

export const getTasks = async () => {
  const response = await axiosInstance.get('/tasks');
  return response.data;
};

export const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
  const response = await axiosInstance.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (taskId: string, taskData: Partial<Task>) => {
  const response = await axiosInstance.put(`/tasks/${taskId}`, taskData);
  return response.data;
};

export const deleteTask = async (taskId: string) => {
  const response = await axiosInstance.delete(`/tasks/${taskId}`);
  return response.data;
};

export const completeTask = async (taskId: string) => {
  const response = await axiosInstance.post(`/tasks/${taskId}/complete`);
  return response.data;
};
