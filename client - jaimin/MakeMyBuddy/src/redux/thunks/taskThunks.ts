import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createTask,
  deleteTask,
  getAllTasks,
  toggleTaskStatus
} from '@/api/task.api';
import {
  addTask,
  removeTask,
  setError,
  setLoading,
  setTasks,
  updateTask
} from '../slices/taskSlice';

export const fetchTasksThunk = createAsyncThunk(
    'task/fetchTasks',
    async (_, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      dispatch(setLoading());
      try {
        const tasks = await getAllTasks(token);
        dispatch(setTasks(tasks));
        return tasks;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const createTaskThunk = createAsyncThunk(
    'task/createTask',
    async (
        {content, category, isPrivate}: {
          content: string;
          category: string;
          isPrivate: boolean
        },
        {getState, dispatch}
    ) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        const task = await createTask(token, content, category, isPrivate);
        dispatch(addTask(task));
        return task;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const toggleTaskStatusThunk = createAsyncThunk(
    'task/toggleTaskStatus',
    async (taskId: string, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        const updatedTask = await toggleTaskStatus(token, taskId);
        dispatch(updateTask(updatedTask));
        return updatedTask;
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);

export const deleteTaskThunk = createAsyncThunk(
    'task/deleteTask',
    async (taskId: string, {getState, dispatch}) => {
      const state = getState() as any;
      const token = state.auth.token;
      if (!token) throw new Error('No token found');
      try {
        await deleteTask(token, taskId);
        dispatch(removeTask(taskId));
      } catch (error: any) {
        dispatch(setError(error.message));
        throw error;
      }
    }
);
