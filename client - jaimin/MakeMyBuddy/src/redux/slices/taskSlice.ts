import {createSlice} from '@reduxjs/toolkit';
import {ITask} from '@/types/task';
import {
  addNewTaskThunk,
  fetchTasksThunk,
  removeTaskThunk,
  toggleTaskCompletionThunk,
  updateTaskThunk
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
        .addCase(fetchTasksThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(fetchTasksThunk.fulfilled, (state, action) => {
          state.tasks = action.payload;
          state.loading = false;
        })
        .addCase(fetchTasksThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to fetch tasks';
        })

    // Add task
    builder
        .addCase(addNewTaskThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(addNewTaskThunk.fulfilled, (state, action) => {
          state.tasks.push(action.payload);
          state.loading = false;
        })
        .addCase(addNewTaskThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.error.message || 'Failed to create task';
        })

    // Toggle task status
    builder
        .addCase(toggleTaskCompletionThunk.fulfilled, (state, action) => {
          const index = state.tasks.findIndex(task => task._id === action.payload._id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        })

    // Delete task
    builder
        .addCase(removeTaskThunk.fulfilled, (state, action) => {
          state.tasks = state.tasks.filter(task => task._id !== action.payload);
        })

    // Update task
    builder
        .addCase(updateTaskThunk.fulfilled, (state, action) => {
          const index = state.tasks.findIndex(task => task._id === action.payload._id);
          if (index !== -1) {
            state.tasks[index] = action.payload;
          }
        })
  },
});

export const {clearErrors} = taskSlice.actions;
export default taskSlice.reducer;
