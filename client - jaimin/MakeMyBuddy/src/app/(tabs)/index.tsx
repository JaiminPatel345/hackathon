import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchTasksThunk } from '@/redux/thunks/taskThunks';
import { fetchBuddyRequestsThunk } from '@/redux/thunks/buddyRequestThunks';
import TaskItem from '@/components/TaskItem';
import { router } from 'expo-router';
import { IBuddyRequest } from '@/types/buddyRequest';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);
  const { sentRequests, receivedRequests, loading: buddyRequestsLoading } = useSelector(
    (state: RootState) => state.buddyRequests
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, []);

  // Combine both sent and received requests for display
  const allBuddyRequests = [...sentRequests, ...receivedRequests];

  useEffect(() => {
    dispatch(fetchTasksThunk());
    dispatch(fetchBuddyRequestsThunk());
  }, [dispatch]);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      dispatch(fetchTasksThunk()),
      dispatch(fetchBuddyRequestsThunk())
    ]);
    setRefreshing(false);
  };

  const navigateToChat = (buddyRequestId: string) => {
    router.push(`../chat/${buddyRequestId}`);
  };

  // Separate tasks into my tasks and buddy tasks
  const myTasks = tasks.filter(task => task.isPrivate);
  const buddyTasks = tasks.filter(task => !task.isPrivate);

  // Function to get time-based greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (tasksLoading || buddyRequestsLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView 
        className="flex-1"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Header */}
        <LinearGradient
          colors={['#3b82f6', '#2563eb']}
          className="px-6 pt-12 pb-6 rounded-b-3xl"
        >
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white text-lg opacity-90">{getGreeting()}</Text>
              <Text className="text-white text-2xl font-bold">{user?.name}</Text>
            </View>
            {user?.avatar ? (
              <Image 
                source={{ uri: user.avatar }} 
                className="w-12 h-12 rounded-full" 
              />
            ) : (
              <View className="bg-white/20 w-12 h-12 rounded-full items-center justify-center">
                <Ionicons name="person" size={24} color="white" />
              </View>
            )}
          </View>
          
          <View className="bg-white/20 p-3 rounded-xl">
            <Text className="text-white text-sm opacity-90">Current Goal</Text>
            <Text className="text-white font-medium text-base">{user?.goal?.title || 'Set a goal in your profile'}</Text>
          </View>
        </LinearGradient>

        <View className="px-4 py-6">
          {/* My Tasks Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">My Tasks</Text>
              <TouchableOpacity onPress={() => router.push("/chat")}>
                <Text className="text-blue-500">See All</Text>
              </TouchableOpacity>
            </View>
            
            {myTasks.length > 0 ? (
              <FlatList
                data={myTasks}
                renderItem={({ item }) => <TaskItem task={item} />}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-1"
              />
            ) : (
              <View className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-gray-500 text-center">No personal tasks available</Text>
              </View>
            )}
          </View>

          {/* Buddy Tasks Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">Buddy Tasks</Text>
              <TouchableOpacity onPress={() => router.push("/chat")}>
                <Text className="text-blue-500">See All</Text>
              </TouchableOpacity>
            </View>
            
            {buddyTasks.length > 0 ? (
              <FlatList
                data={buddyTasks}
                renderItem={({ item }) => <TaskItem task={item} />}
                keyExtractor={(item) => item._id}
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mb-1"
              />
            ) : (
              <View className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-gray-500 text-center">No buddy tasks available</Text>
              </View>
            )}
          </View>

          {/* Buddy Requests Section */}
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Buddy Requests</Text>
            {allBuddyRequests.length > 0 ? (
              <View>
                {allBuddyRequests.map((item) => (
                  <TouchableOpacity
                    key={item._id}
                    className="bg-gray-50 p-4 rounded-xl mb-3 border border-gray-100"
                    onPress={() => navigateToChat(item._id)}
                  >
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        {item.sender.avatar ? (
                          <Image 
                            source={{ uri: item.sender.avatar }} 
                            className="w-10 h-10 rounded-full mr-3" 
                          />
                        ) : (
                          <View className="bg-blue-100 w-10 h-10 rounded-full items-center justify-center mr-3">
                            <Ionicons name="person" size={18} color="#3b82f6" />
                          </View>
                        )}
                        <View>
                          <Text className="font-medium">{item.sender.name}</Text>
                          <Text className="text-gray-500 text-sm">{item.type}</Text>
                        </View>
                      </View>
                      <View className={`px-3 py-1 rounded-full ${getStatusColor(item.status)}`}>
                        <Text className="text-xs text-white">{item.status}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View className="bg-gray-50 p-4 rounded-xl">
                <Text className="text-gray-500 text-center">No buddy requests available</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Add Task Floating Button */}
      <TouchableOpacity 
        className="absolute right-5 bottom-5 bg-blue-500 w-24 h-16 rounded-[20] items-center justify-center shadow-lg flex-row"
        style={{ 
          shadowColor: '#000', 
          shadowOffset: { width: 0, height: 4 }, 
          shadowOpacity: 0.3, 
          shadowRadius: 6,
          elevation: 8 
        }}
        onPress={() => router.push('/create-task')}
      >
        <Ionicons name="add" size={24} color="white"  className=''/>
        <Text className="text-white text-lg font-bold p-2">Task</Text>
      </TouchableOpacity>
    </View>
  );
}

// Helper function to get color based on status
function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-yellow-500';
    case 'ACCEPTED':
      return 'bg-green-500';
    case 'REJECTED':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}