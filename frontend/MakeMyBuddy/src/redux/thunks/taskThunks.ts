import {createAsyncThunk} from '@reduxjs/toolkit';
import {
  createTask,
  deleteTask,
  getAllTasks,
  toggleTaskStatus,
  updateTaskDetails
} from '@/api/task.api';
import {IUpdateTaskRequest} from "@/types/request";

// Create a new task
export const addNewTaskThunk = createAsyncThunk(
    'task/createTask',
    async (
        {content, category, isPrivate}: {
          content: string;
          category: string;
          isPrivate: boolean;
        }
    ) => {
      return await createTask(content, category, isPrivate);
    }
);

// Fetch all tasks
export const fetchTasksThunk = createAsyncThunk(
    'task/getAllTasks',
    async () => {
      return await getAllTasks();
    }
);

// Toggle task completion status
export const toggleTaskCompletionThunk = createAsyncThunk(
    'task/toggleStatus',
    async (taskId: string) => {
      return await toggleTaskStatus(taskId);
    }
);

// Remove a task
export const removeTaskThunk = createAsyncThunk(
    'task/removeTask',
    async (taskId: string) => {
      return await deleteTask(taskId);
    }
);

// Update task details
export const updateTaskThunk = createAsyncThunk(
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
      // Ensure progress is a number
      const progressNum = typeof progress === 'string' ? parseInt(progress, 10) : progress;
      return await updateTaskDetails(taskId, content, progressNum, category, isPrivate);
    }
);