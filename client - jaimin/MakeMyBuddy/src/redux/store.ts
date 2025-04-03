import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import buddyReducer from './slices/buddySlice';
import taskReducer from './slices/taskSlice';
import chatReducer from './slices/chatSlice';
import resourceReducer from './slices/resourceSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    buddy: buddyReducer,
    tasks: taskReducer,
    chat: chatReducer,
    resources: resourceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;