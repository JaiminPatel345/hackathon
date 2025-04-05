import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Easing } from 'react-native';
import { ITask } from '../types/task';
import { useDispatch } from 'react-redux';
import { toggleTaskCompletionThunk } from '@/redux/thunks/taskThunks';
import { ThunkDispatch } from "redux-thunk";
import ProgressBar from './ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface TaskItemProps {
  task: ITask;
}

export default function TaskItem({ task }: TaskItemProps) {
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.back(1.5)),
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleToggle = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      dispatch(toggleTaskCompletionThunk(task._id));
    });
  };

  // Check if progress strings are numeric or text
  const isMyProgressNumeric = task.progressOfMe ? !isNaN(parseInt(task.progressOfMe, 10)) : false;
  const isBuddyProgressNumeric = task.progressOfBuddy ? !isNaN(parseInt(task.progressOfBuddy, 10)) : false;
  
  // Convert progress strings to numbers if they're numeric, otherwise use as text
  const myProgress = isMyProgressNumeric 
    ? parseInt(task.progressOfMe || '0', 10) 
    : (task.progressOfMe || 'Not started');
    
  const buddyProgress = isBuddyProgressNumeric 
    ? parseInt(task.progressOfBuddy || '0', 10) 
    : (task.progressOfBuddy || 'Not started');

  // Determine due date status
  const getDueDateStatus = () => {
    if (!task.dueDate) return null;
    
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    const diffDays = Math.round((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Overdue', color: 'text-red-600', bgColor: 'bg-red-100' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600', bgColor: 'bg-orange-100' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else if (diffDays <= 3) {
      return { text: `Due in ${diffDays} days`, color: 'text-yellow-600', bgColor: 'bg-yellow-100' };
    } else {
      return { text: `Due in ${diffDays} days`, color: 'text-blue-600', bgColor: 'bg-blue-100' };
    }
  };

  const dueDateStatus = getDueDateStatus();

  return (
    <Animated.View 
      style={{ 
        opacity: opacityAnim,
        transform: [{ scale: scaleAnim }]
      }}
      className="mx-2 w-72"
    >
      <View className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
        {/* Priority indicator - if available */}
        {task.priority && (
          <View className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
            task.priority === 'HIGH' ? 'bg-red-500' : 
            task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
          }`} />
        )}
        
        <View className="flex-row justify-between items-start mb-3">
          <View className="flex-1 pr-4">
            <Text className="font-semibold text-base text-gray-800">{task.content}</Text>
            {task.description && (
              <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
                {task.description}
              </Text>
            )}
          </View>
          <View className={`px-2 py-1 rounded-full ${getCategoryColor(task.category)}`}>
            <Text className="text-xs text-white">{task.category}</Text>
          </View>
        </View>
        
        {/* Due date if available */}
        {dueDateStatus && (
          <View className={`self-start mb-3 px-2 py-0.5 rounded-md ${dueDateStatus.bgColor}`}>
            <Text className={`text-xs ${dueDateStatus.color}`}>{dueDateStatus.text}</Text>
          </View>
        )}
        
        {/* Progress section */}
        <View className="mb-3">
          <ProgressBar 
            progress={myProgress} 
            label="My Progress" 
            color="#3b82f6"
            showPercentage={isMyProgressNumeric}
          />
          <ProgressBar 
            progress={buddyProgress} 
            label="Buddy Progress" 
            color="#ec4899"
            showPercentage={isBuddyProgressNumeric}
          />
        </View>

        {/* Status section */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity 
            onPress={handleToggle}
            className={`flex-row items-center px-3 py-1.5 rounded-full ${task.isDoneByMe ? 'bg-green-100' : 'bg-gray-100'}`}
            activeOpacity={0.8}
          >
            {task.isDoneByMe && <Ionicons name="checkmark-circle" size={14} color="#16a34a" className="mr-1" />}
            <Text className={`text-xs ${task.isDoneByMe ? 'text-green-600' : 'text-gray-600'}`}>
              {task.isDoneByMe ? 'Completed' : 'Mark Done'}
            </Text>
          </TouchableOpacity>
          
          <View className={`flex-row items-center px-3 py-1.5 rounded-full ${task.isDoneByBuddy ? 'bg-green-100' : 'bg-yellow-100'}`}>
            {task.isDoneByBuddy && <Ionicons name="checkmark-circle" size={14} color="#16a34a" className="mr-1" />}
            <Text className={`text-xs ${task.isDoneByBuddy ? 'text-green-600' : 'text-yellow-600'}`}>
              Buddy: {task.isDoneByBuddy ? 'Completed' : 'Pending'}
            </Text>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

// Helper function to get background color based on category
function getCategoryColor(category: string): string {
  switch (category) {
    case 'Daily':
      return 'bg-blue-500';
    case 'Weekly':
      return 'bg-purple-500';
    case 'Monthly':
      return 'bg-orange-500';
    case 'Yearly':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
}