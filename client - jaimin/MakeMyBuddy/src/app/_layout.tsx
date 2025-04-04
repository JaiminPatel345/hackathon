import React, { useEffect, useState } from 'react';
import { useSelector, Provider, useDispatch } from 'react-redux';
import { Redirect, Slot, Stack } from 'expo-router';
import { RootState, store, persistor } from '@/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { getToken, getUser } from '@/services/authService';
import { initializeFromStorage } from '@/redux/slices/authSlice';
import '../styles/global.css';
import '../styles/fix.css';

// App wrapper component to handle auth check
function AppContent() {
  const [isLoading, setIsLoading] = useState(true);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const dispatch = useDispatch();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const token = await getToken();
        const user = await getUser();
        
        if (token && user) {
          dispatch(initializeFromStorage({ token, user }));
        }
      } catch (error) {
        console.error('Failed to load auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [dispatch]);

  if (isLoading) {
    return null; // Or show a loading spinner
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="auth" 
        redirect={isAuthenticated} 
      />
      <Stack.Screen 
        name="(tabs)" 
        redirect={!isAuthenticated} 
      />
      <Stack.Screen 
        name="user" 
        redirect={!isAuthenticated} 
      />
      <Stack.Screen 
        name="chat" 
        redirect={!isAuthenticated} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
}