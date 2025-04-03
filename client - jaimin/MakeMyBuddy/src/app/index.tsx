import { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../redux/slices/userSlice';
import { AppDispatch } from '../redux/store';
import Colors from '../constants/Colors';
import '../styles/global.css';

export default function AppEntry() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');

        if (token) {
          // If token exists, try to fetch user data
          await dispatch(fetchCurrentUser());
          router.replace('/(tabs)/');
        } else {
          // No token, go to login
          router.replace('/(auth)/login');
        }
      } catch (error) {
        // Error fetching user, go to login
        router.replace('/(auth)/login');
      }
    };

    checkAuth();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text className="mt-4 text-gray-600">Loading Make My Buddy...</Text>
    </View>
  );
}