import { useEffect } from 'react';
import { useSelector, Provider } from 'react-redux';
import { Redirect, Slot, Stack } from 'expo-router';
import { RootState, store } from '@/redux/store';
import '../styles/global.css';

function RootLayoutNav() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // If not authenticated, redirect to auth flow
  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="user" options={{ headerShown: false }} />
        <Stack.Screen name="chat" options={{ headerShown: false }} />
      </Stack>
      <RootLayoutNav />
    </Provider>
  );
}