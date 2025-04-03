// src/app/(tabs)/profile.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchUserProfile, logoutUser } from '../../redux/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, buddy, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile());
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    router.replace('/(auth)/login');
  };

  const handleEditProfile = () => {
    router.navigate('/profile/edit');
  };

  const handleViewBlockedUsers = () => {
    router.navigate('/profile/blocked-users');
  };

  const handleViewPreviousBuddies = () => {
    router.navigate('/profile/previous-buddies');
  };

  if (loading || !user) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        <View className="items-center mb-6">
          {user.profilePic ? (
            <Image
              source={{ uri: user.profilePic }}
              className="w-24 h-24 rounded-full"
            />
          ) : (
            <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
              <Text className="text-2xl font-bold">{user.name?.charAt(0)}</Text>
            </View>
          )}
          <Text className="text-xl font-bold mt-2">{user.name}</Text>
          <Text className="text-gray-600">{user.email}</Text>
        </View>

        <View className="mb-6 bg-gray-100 p-4 rounded-lg">
          <Text className="font-bold text-lg mb-2">My Goal</Text>
          <Text>Title: {user.goal?.title}</Text>
          <Text>Target: {user.goal?.target}</Text>
          <Text>Year: {user.goal?.year}</Text>
          <Text>Level: {user.goal?.level}</Text>
        </View>

        {buddy && (
          <View className="mb-6 bg-gray-100 p-4 rounded-lg">
            <Text className="font-bold text-lg mb-2">My Buddy</Text>
            <View className="flex-row items-center">
              {buddy.profilePic ? (
                <Image
                  source={{ uri: buddy.profilePic }}
                  className="w-12 h-12 rounded-full mr-3"
                />
              ) : (
                <View className="w-12 h-12 rounded-full bg-gray-300 items-center justify-center mr-3">
                  <Text className="text-lg font-bold">{buddy.name?.charAt(0)}</Text>
                </View>
              )}
              <View>
                <Text className="font-bold">{buddy.name}</Text>
                <Text className="text-gray-600">{buddy.goal?.title}</Text>
              </View>
            </View>
          </View>
        )}

        <View className="mb-6">
          <TouchableOpacity
            className="flex-row items-center p-3 border-b border-gray-200"
            onPress={handleEditProfile}
          >
            <Ionicons name="person-outline" size={20} color="black" />
            <Text className="ml-3">Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-3 border-b border-gray-200"
            onPress={handleViewBlockedUsers}
          >
            <Ionicons name="ban-outline" size={20} color="black" />
            <Text className="ml-3">Blocked Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-3 border-b border-gray-200"
            onPress={handleViewPreviousBuddies}
          >
            <Ionicons name="people-outline" size={20} color="black" />
            <Text className="ml-3">Previous Buddies</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-red-500 p-3 rounded-lg items-center"
          onPress={handleLogout}
        >
          <Text className="text-white font-bold">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}