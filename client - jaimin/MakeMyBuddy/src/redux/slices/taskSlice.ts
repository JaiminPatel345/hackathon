import {createSlice} from '@reduxjs/toolkit';
import {ITask} from '@/types/task';
import {
  addNewTask,
  fetchTasks,
  removeTask,
  toggleTaskCompletion,
  updateTask
} from '../thunks/taskThunks';

interface TaskState {
  tasks: ITask[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch tasks
    builder
        .addCase(fetchTasks.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTasks.fulfilled, (state, action) => {
          state.tasks = action.payload;
          state.loading = false;
        })
        .addCase(fetchTasks.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch tasks';
        })

    // Add task
    builder
        .addCase(addNewTask.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addNewTask.fulfilled, (state, action) => {
          state.tasks.push(action.payload);
          state.loading = false;
        })
        .addCase(addNewTask.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to create task';
        })

    // Toggle task status
    builder
        .addCase(toggleTaskCompletion.fulfilled, (state, action) => {
          const index = state.tasks.findIndex(task => task._id === action.payload._id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        })

    // Delete task
    builder
        .addCase(removeTask.fulfilled, (state, action) => {
          state.tasks = state.tasks.filter(task => task._id !== action.payload);
        })

    // Update task
    builder
        .addCase(updateTask.fulfilled, (state, action) => {
          const index = state.tasks.findIndex(task => task._id === action.payload._id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        });
  },
});

export const {clearErrors} = taskSlice.actions;
export default taskSlice.reducer;