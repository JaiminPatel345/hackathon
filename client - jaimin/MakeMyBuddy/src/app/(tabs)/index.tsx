import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTasksThunk } from '@/redux/thunks/taskThunks';
import { fetchBuddyRequestsThunk } from '@/redux/thunks/buddyRequestThunks';
import TaskItem from '@/components/TaskItem';
import { router } from 'expo-router';
import { IBuddyRequest } from '@/types/buddyRequest';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);
  const { sentRequests, receivedRequests, loading: buddyRequestsLoading } = useSelector(
    (state: RootState) => state.buddyRequests
  );
  const { user } = useSelector((state: RootState) => state.auth);

  // Combine both sent and received requests for display
  const allBuddyRequests = [...sentRequests, ...receivedRequests];

  useEffect(() => {
    dispatch(fetchTasksThunk());
    dispatch(fetchBuddyRequestsThunk());
  }, [dispatch]);

  const navigateToChat = (buddyRequestId: string) => {
    // Navigate to chat with the buddy request ID instead of chat ID
    router.push(`../chat/${buddyRequestId}`);
  };

  if (tasksLoading || buddyRequestsLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-6">Welcome, {user?.name}</Text>

      <View className="mb-6">
        <Text className="text-xl font-semibold mb-3">Your Tasks</Text>
        {tasks.length > 0 ? (
          <FlatList
            data={tasks}
            renderItem={({ item }) => <TaskItem task={item} />}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mb-4"
          />
        ) : (
          <Text className="text-gray-500">No tasks available</Text>
        )}
      </View>

      <View>
        <Text className="text-xl font-semibold mb-3">Buddy Requests</Text>
        {allBuddyRequests.length > 0 ? (
          <FlatList
            data={allBuddyRequests}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="bg-gray-100 p-4 rounded-lg mb-3"
                onPress={() => navigateToChat(item._id)}
              >
                <Text className="font-medium">{item.sender.name}</Text>
                <Text className="text-gray-500 mt-1">Request Type: {item.type}</Text>
                <Text className="text-blue-500 mt-2">
                  Status: {item.status}
                </Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <Text className="text-gray-500">No buddy requests available</Text>
        )}
      </View>
    </View>
  );
}