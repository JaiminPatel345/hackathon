import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createTask,
  deleteTask,
  getAllTasks,
  toggleTaskStatus,
  updateTaskDetails
} from '@/api/task.api';
import {store} from '../store';
import {IUpdateTaskRequest} from "@/types/request";

// Helper function to get token from state
const getTokenFromState = () => {
  const state = store.getState();
  const token = state.auth.token;
  if (!token) throw new Error('Authentication required');
  return token;
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
    'task/fetchTasks',
    async (_) => {
      const token = getTokenFromState();
      return await getAllTasks(token);
    }
);

// Create a new task
export const addNewTask = createAsyncThunk(
    'task/createTask',
    async (
        {content, category, isPrivate}: {
          content: string;
          category: string;
          isPrivate: boolean;
        }
    ) => {
      const token = getTokenFromState();
      return await createTask(token, content, category, isPrivate);
    }
);

// Toggle task completion status
export const toggleTaskCompletion = createAsyncThunk(
    'task/toggleStatus',
    async (taskId: string) => {
      const token = getTokenFromState();
      return await toggleTaskStatus(token, taskId);
    }
);

// Delete a task
export const removeTask = createAsyncThunk(
    'task/deleteTask',
    async (taskId: string) => {
      const token = getTokenFromState();
      await deleteTask(token, taskId);
      return taskId;
    }
);

// Update task details (assuming this API function exists)
export const updateTask = createAsyncThunk(
    'task/updateTask',
    async (
        {
          taskId,
          content,
          category,
          progress,
          finishDate,
          isPrivate
        }: IUpdateTaskRequest
    ) => {
      const token = getTokenFromState();
      return await updateTaskDetails(token, taskId, content, progress, category, isPrivate);
    }
);