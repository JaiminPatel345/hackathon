import { Stack, Tabs } from 'expo-router';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from 'react-native';

export default function RootLayout() {
  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        // Handle token validation logic here
      } catch (error) {
        console.error("Failed to check authentication", error);
      }
    };

    checkAuth();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <Stack>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="user/profile/[id]" options={{ title: "User Profile" }} />
        </Stack>
      </SafeAreaProvider>
    </Provider>
  );
}