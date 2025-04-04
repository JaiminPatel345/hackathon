import React from 'react';
import { View, Text, Image } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getUserProfile } from '@/api/user.api';

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const token = useSelector((state: RootState) => state.auth.token);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (token) {
      getUserProfile(id as string).then(setUser);
    }
  }, [id, token]);

  return (
    <View className="flex-1 p-4">
      <Text className="text-2xl mb-4">User Profile</Text>
      {user && (
        <>
          <Image source={{ uri: user.avatar }} className="w-24 h-24 rounded-full mb-4" />
          <Text className="text-lg">Name: {user.name}</Text>
          <Text>Username: {user.username}</Text>
          <Text>Goal: {user.goal.title}</Text>
        </>
      )}
    </View>
  );
}