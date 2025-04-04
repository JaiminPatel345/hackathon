import {axiosInstance} from '@/api/axiosInstance';
import {ITask} from '@/types/task';

export const createTask = async (
    token: string,
    content: string,
    category: string,
    isPrivate: boolean
): Promise<ITask> => {
  const response = await axiosInstance.post(
      '/task/',
      {content, category, isPrivate},
      {headers: {Authorization: `Bearer ${token}`}}
  );
  return response.data.data;
};

export const toggleTaskStatus = async (token: string, taskId: string): Promise<ITask> => {
  const response = await axiosInstance.put(
      '/task/toggle-status',
      {taskId},
      {headers: {Authorization: `Bearer ${token}`}}
  );
  return response.data.data;
};

export const deleteTask = async (token: string, taskId: string): Promise<void> => {
  await axiosInstance.delete(`/task/${taskId}`, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const getAllTasks = async (token: string): Promise<ITask[]> => {
  const response = await axiosInstance.get('/task/', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.data.tasks || [];
};

export const updateTaskDetails = async (
    token: string,
    taskId: string,
    content?: string,
    progress?: string,
    category?: string,
    isPrivate?: boolean
): Promise<ITask> => {
  const response = await axiosInstance.put(
      `/task/${taskId}`,
      {content, category, progress, isPrivate},
      {headers: {Authorization: `Bearer ${token}`}}
  );
  return response.data.data;
}