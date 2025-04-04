import {axiosInstance} from '@/api/axiosInstance';
import {ITask} from '@/types/task';

export const createTask = async (
    content: string,
    category: string,
    isPrivate: boolean
): Promise<ITask> => {
  const response = await axiosInstance.post(
      '/task/',
      {content, category, isPrivate}
  );
  return response.data.data;
};

export const toggleTaskStatus = async (taskId: string): Promise<ITask> => {
  const response = await axiosInstance.put(
      '/task/toggle-status',
      {taskId}
  );
  return response.data.data;
};

export const deleteTask = async (taskId: string): Promise<string> => {
  await axiosInstance.delete(`/task/${taskId}`);
  return taskId;
};

export const getAllTasks = async (): Promise<ITask[]> => {
  const response = await axiosInstance.get('/task/');
  return response.data.data.tasks || [];
};

export const updateTaskDetails = async (
    taskId: string,
    content?: string,
    progress?: number,
    category?: string,
    isPrivate?: boolean
): Promise<ITask> => {
  const response = await axiosInstance.put(
      '/task/update',
      {taskId, content, progress, category, isPrivate}
  );
  return response.data.data;
};