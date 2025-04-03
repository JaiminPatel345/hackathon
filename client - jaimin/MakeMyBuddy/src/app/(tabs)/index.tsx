import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import { fetchCurrentUser } from '../../redux/slices/userSlice';
import { fetchCurrentBuddy, fetchBuddySuggestions } from '../../redux/slices/buddySlice';
import { fetchTasks } from '../../redux/slices/taskSlice';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import CalendarView from '../../components/home/CalendarView';
import TaskList from '../../components/home/TaskList';
import BuddySuggestions from '../../components/home/BuddySuggestions';
import GoalCard from '../../components/home/GoalCard';
import AddTaskModal from '../../components/home/AddTaskModal';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentUser, loading: userLoading } = useSelector((state: RootState) => state.user);
  const { currentBuddy, buddySuggestions, loading: buddyLoading } = useSelector((state: RootState) => state.buddy);
  const { tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    dispatch(fetchCurrentUser());
    dispatch(fetchCurrentBuddy());
    dispatch(fetchTasks());

    if (!currentBuddy) {
      dispatch(fetchBuddySuggestions());
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  if (userLoading && !currentUser) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View className="px-4 pt-8 pb-20">
        {/* Header and Greeting */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-600">Hello,</Text>
            <Text className="text-2xl font-bold">{currentUser?.name}</Text>
          </View>
          <TouchableOpacity
            className="bg-blue-100 p-2 rounded-full"
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Goal Card */}
        {currentUser?.goal && (
          <GoalCard goal={currentUser.goal} />
        )}

        {/* Calendar View */}
        <View className="mt-6">
          <Text className="text-lg font-bold mb-2">Your Schedule</Text>
          <CalendarView tasks={tasks} />
        </View>

        {/* Daily Tasks */}
        <View className="mt-6">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-bold">Daily Tasks</Text>
            <TouchableOpacity
              className="bg-blue-600 px-3 py-2 rounded-lg flex-row items-center"
              onPress={() => setShowAddTaskModal(true)}
            >
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white ml-1">Add Task</Text>
            </TouchableOpacity>
          </View>

          <TaskList
            tasks={tasks.filter(task => {
              const taskDate = new Date(task.dueDate);
              const today = new Date();
              return taskDate.toDateString() === today.toDateString();
            })}
            isLoading={tasksLoading}
            currentBuddy={currentBuddy}
          />
        </View>

        {/* Buddy Section */}
        {!currentBuddy ? (
          <View className="mt-6">
            <Text className="text-lg font-bold mb-2">Find Your Study Buddy</Text>
            <BuddySuggestions
              suggestions={buddySuggestions}
              isLoading={buddyLoading}
            />
          </View>
        ) : (
          <View className="mt-6">
            <Text className="text-lg font-bold mb-2">Your Study Buddy</Text>
            <TouchableOpacity
              className="bg-gray-100 p-4 rounded-lg flex-row items-center"
              onPress={() => router.push(`/user/profile/${currentBuddy.id}`)}
            >
              <View className="w-12 h-12 bg-blue-200 rounded-full items-center justify-center">
                <Text className="text-xl font-bold text-blue-600">
                  {currentBuddy.name.charAt(0)}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="font-bold text-gray-800">{currentBuddy.name}</Text>
                <Text className="text-gray-600">{currentBuddy.goal?.title || 'Goal not set'}</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={Colors.gray} style={{ marginLeft: 'auto' }} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Add Task Modal */}
      <AddTaskModal
        visible={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        currentBuddy={currentBuddy}
      />
    </ScrollView>
  );
}