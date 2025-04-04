import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, ActivityIndicator, Modal, FlatList, Dimensions, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { TaskCategory } from '@/types/task';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { addNewTaskThunk, fetchTasksThunk } from '@/redux/thunks/taskThunks';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { Calendar } from 'react-native-calendars';

const { width, height } = Dimensions.get('window');

export default function CreateTaskScreen() {
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  
  const [taskContent, setTaskContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<TaskCategory>(TaskCategory.Daily);
  const [isPrivate, setIsPrivate] = useState(false);
  const [progress, setProgress] = useState('');
  const [isNumericProgress, setIsNumericProgress] = useState(false);
  const [finishDate, setFinishDate] = useState('');
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  
  // Check if progress contains "%" to consider it as percentage
  useEffect(() => {
    const isPercentage = progress.includes('%');
    setIsNumericProgress(isPercentage);
  }, [progress]);
  
  // Format date for display based on category
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    switch (selectedCategory) {
      case TaskCategory.Yearly:
        return new Date(dateString).getFullYear().toString();
      case TaskCategory.Monthly:
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      default:
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
    }
  };
  
  const handleCreateTask = async () => {
    if (!taskContent.trim()) {
      // Show error if content is empty
      return;
    }
    
    setLoading(true);
    
    try {
      // Create task with additional fields
      await dispatch(addNewTaskThunk({
        content: taskContent,
        category: selectedCategory,
        isPrivate,
        ...(finishDate && { finishDate }),
        ...(progress && { progress })
      }));
      
      // Fetch tasks to update the list
      await dispatch(fetchTasksThunk());
      
      // Navigate back to home screen after successful creation
      router.back();
    } catch (error) {
      console.error('Failed to create task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle opening the appropriate date picker based on category
  const handleOpenDatePicker = () => {
    if (selectedCategory === TaskCategory.Yearly) {
      setShowYearPicker(true);
    } else if (selectedCategory === TaskCategory.Monthly) {
      setShowMonthPicker(true);
    } else {
      setCalendarVisible(true);
    }
  };

  // Generate years for year picker (current year + 10 years)
  const years = Array.from({ length: 11 }, (_, i) => new Date().getFullYear() + i);
  
  // Generate months for month picker
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Handle year selection
  const handleYearSelect = (year: number) => {
    const newDate = new Date();
    newDate.setFullYear(year);
    setFinishDate(newDate.toISOString().split('T')[0]);
    setShowYearPicker(false);
  };

  // Handle month selection
  const handleMonthSelect = (monthIndex: number) => {
    const newDate = new Date();
    newDate.setMonth(monthIndex);
    // Set to first day of selected month
    newDate.setDate(1);
    setFinishDate(newDate.toISOString().split('T')[0]);
    setShowMonthPicker(false);
  };

  // Get icon for category
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case TaskCategory.Daily:
        return 'today-outline';
      case TaskCategory.Weekly:
        return 'calendar-outline';
      case TaskCategory.Monthly:
        return 'calendar-clear-outline';
      case TaskCategory.Yearly:
        return 'calendar-number-outline';
      default:
        return 'list-outline';
    }
  };
  
  // Get numeric progress value if applicable
  const getNumericProgress = () => {
    if (!isNumericProgress) return 0;
    
    // Extract percentage value from string (remove % sign)
    const percentValue = progress.replace('%', '').trim();
    
    // Parse to integer, ensuring value is between 0-100
    return Math.min(Math.max(0, parseInt(percentValue, 10) || 0), 100);
  };

  // Add % sign to progress if needed
  const handleProgressChange = (text: string) => {
    setProgress(text);
  };
  
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
      className="flex-1 bg-white"
    >
      {/* Header */}
      <LinearGradient
        colors={['#3b82f6', '#1d4ed8']}
        className="pt-16 pb-8 px-5 shadow-lg"
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity 
              onPress={() => router.back()} 
              className="mr-4 bg-white/30 rounded-full p-2.5 active:bg-white/50"
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-xl font-bold">Create New Task</Text>
          </View>
          
          <TouchableOpacity 
            onPress={handleCreateTask}
            disabled={loading || !taskContent.trim()}
            className={`px-4 py-2 rounded-full ${
              loading || !taskContent.trim() ? 'bg-white/20' : 'bg-white'
            }`}
          >
            {loading ? (
              <ActivityIndicator color={loading || !taskContent.trim() ? "white" : "#3b82f6"} size="small" />
            ) : (
              <Text className={`font-semibold ${loading || !taskContent.trim() ? 'text-white/70' : 'text-blue-600'}`}>
                Create
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView className="flex-1 p-5">
        {/* Task Content - Redesigned Goal Section */}
        <View className="mb-10">
          <View className="flex-row items-center mb-4">
            <View className="h-8 w-2 bg-blue-500 rounded-full mr-3" />
            <Text className="text-gray-800 text-lg font-bold">What's your goal?</Text>
          </View>
          
          <View className="relative">
            <View 
              style={{ 
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#EBF5FF',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                zIndex: 10
              }}
            >
              <Text className="text-blue-600 text-xs font-medium">{taskContent.length}/500</Text>
            </View>

            <View 
              className="p-1 rounded-xl bg-gradient-to-r from-blue-100 via-blue-50 to-white"
              style={{ 
                shadowColor: '#3b82f6', 
                shadowOffset: { width: 0, height: 4 }, 
                shadowOpacity: 0.1, 
                shadowRadius: 8,
                elevation: 3
              }}
            >
              <View className="bg-white rounded-lg overflow-hidden">
                <TextInput
                  value={taskContent}
                  onChangeText={(text) => setTaskContent(text.slice(0, 500))}
                  placeholder="I want to..."
                  multiline
                  className="p-4 text-base min-h-[140px]"
                  textAlignVertical="top"
                  maxLength={500}
                  style={{ fontSize: 16, lineHeight: 24 }}
                />
                
                <View className="flex-row items-center p-3 border-t border-gray-100">
                  <View className="bg-blue-50 p-2 rounded-full mr-3">
                    <Ionicons name="bulb-outline" size={18} color="#3b82f6" />
                  </View>
                  <Text className="text-gray-500 text-xs flex-1">
                    Be specific with your goal to increase chances of completion.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        
        {/* Category Selection */}
        <View className="mb-8">
          <Text className="text-gray-800 font-semibold text-base mb-3">Category</Text>
          <View className="flex-row flex-wrap">
            {Object.values(TaskCategory).map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => {
                  setSelectedCategory(category);
                  // Clear finish date when changing category
                  setFinishDate('');
                }}
                className={`mb-3 mr-3 shadow-sm`}
                style={{ 
                  width: (width - 40) / 2 - 6, 
                  shadowColor: '#000', 
                  shadowOffset: { width: 0, height: 1 }, 
                  shadowOpacity: 0.05, 
                  shadowRadius: 3,
                  elevation: 1
                }}
              >
                <View className={`px-3 py-4 rounded-xl flex-row items-center justify-center ${
                  selectedCategory === category
                    ? 'bg-blue-500'
                    : 'bg-white border border-gray-100'
                }`}>
                  <Ionicons 
                    name={getCategoryIcon(category)} 
                    size={18} 
                    color={selectedCategory === category ? 'white' : '#3b82f6'} 
                    style={{ marginRight: 8 }}
                  />
                  <Text
                    className={`${
                      selectedCategory === category ? 'text-white' : 'text-gray-700'
                    } font-medium`}
                  >
                    {category}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Privacy Toggle */}
        <View className="mb-8">
          <Text className="text-gray-800 font-semibold text-base mb-3">Privacy</Text>
          <View 
            className="flex-row items-center justify-between px-5 py-4 rounded-xl bg-white border border-gray-100"
            style={{ 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.05, 
              shadowRadius: 3,
              elevation: 1 
            }}
          >
            <View className="flex-row items-center">
              <View className={`mr-4 p-2 rounded-full ${isPrivate ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <Ionicons 
                  name={isPrivate ? "lock-closed-outline" : "people-outline"} 
                  size={22} 
                  color={isPrivate ? "#3b82f6" : "#64748b"} 
                />
              </View>
              <View>
                <Text className="text-gray-800 font-medium">{isPrivate ? "Private Task" : "Shared with Buddy"}</Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {isPrivate ? "Only visible to you" : "Your buddy can see and update this task"}
                </Text>
              </View>
            </View>
            <Switch
              value={isPrivate}
              onValueChange={setIsPrivate}
              trackColor={{ false: '#d1d5db', true: '#93c5fd' }}
              thumbColor={isPrivate ? '#3b82f6' : '#f4f4f5'}
            />
          </View>
        </View>
        
        {/* Progress Input */}
        <View className="mb-8">
          <Text className="text-gray-800 font-semibold text-base mb-3">Target</Text>
          <View 
            className="p-4 rounded-xl bg-white border border-gray-100"
            style={{ 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.05, 
              shadowRadius: 3,
              elevation: 1 
            }}
          >
            <View className="flex-row items-center mb-4">
              <View className={`mr-4 p-2 rounded-full ${isNumericProgress ? 'bg-blue-50' : 'bg-gray-50'}`}>
                <Ionicons 
                  name={isNumericProgress ? "pie-chart-outline" : "text-outline"} 
                  size={22} 
                  color={isNumericProgress ? "#3b82f6" : "#64748b"} 
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">Task Target</Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {isNumericProgress 
                    ? "Showing as percentage bar" 
                    : "Showing as text description"}
                </Text>
              </View>
            </View>
            
            {/* Single input field for both percentage and text progress */}
            <View className="mb-3">
              <TextInput
                value={progress}
                onChangeText={handleProgressChange}
                placeholder="Enter progress (e.g. 50%, In progress, Started...)"
                className="border border-gray-200 rounded-xl p-4 bg-gray-50 text-base"
              />
            </View>
            
            {/* Progress bar - only shown for numeric progress */}
            {isNumericProgress && (
              <View className="mt-3 bg-gray-50 p-3 rounded-xl">
                <View className="flex-row items-center mb-2">
                  <Text className="mr-2 text-xs text-gray-500">0%</Text>
                  <View className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                    <View
                      className="h-3 bg-blue-500 rounded-full"
                      style={{ width: `${getNumericProgress()}%` }}
                    ></View>
                  </View>
                  <Text className="ml-2 text-xs text-gray-500">100%</Text>
                </View>
                <Text className="text-center text-sm text-gray-600">
                  {getNumericProgress()}% Complete
                </Text>
              </View>
            )}
            
            <Text className="text-xs text-gray-400 mt-3 text-center">
              {isNumericProgress 
                ? "Progress shown as a percentage bar" 
                : "Add % sign to show as a progress bar"}
            </Text>
          </View>
        </View>
        
        {/* Finish Date */}
        <View className="mb-10">
          <Text className="text-gray-800 font-semibold text-base mb-3">
            {selectedCategory === TaskCategory.Yearly 
              ? 'Target Year' 
              : selectedCategory === TaskCategory.Monthly 
                ? 'Target Month' 
                : 'Finish Date'} 
            <Text className="font-normal text-gray-400"> (Optional)</Text>
          </Text>
          <TouchableOpacity 
            onPress={handleOpenDatePicker}
            className="px-5 py-4 rounded-xl bg-white border border-gray-100 flex-row items-center justify-between shadow-sm"
            style={{ 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 1 }, 
              shadowOpacity: 0.05, 
              shadowRadius: 3,
              elevation: 1 
            }}
          >
            <View className="flex-row items-center">
              <View className="mr-4 p-2 rounded-full bg-blue-50">
                <Ionicons 
                  name={
                    selectedCategory === TaskCategory.Yearly 
                      ? 'calendar-number-outline' 
                      : selectedCategory === TaskCategory.Monthly 
                        ? 'calendar-clear-outline' 
                        : 'calendar-outline'
                  } 
                  size={22} 
                  color="#3b82f6" 
                />
              </View>
              <View>
                <Text className={finishDate ? "text-gray-800 font-medium" : "text-gray-400"}>
                  {finishDate ? formatDate(finishDate) : `Select ${
                    selectedCategory === TaskCategory.Yearly 
                      ? 'year' 
                      : selectedCategory === TaskCategory.Monthly 
                        ? 'month' 
                        : 'date'
                  }`}
                </Text>
                {finishDate && (
                  <Text className="text-blue-500 text-xs mt-1">
                    {selectedCategory === TaskCategory.Daily
                      ? 'Daily deadline'
                      : selectedCategory === TaskCategory.Weekly
                        ? 'Weekly deadline'
                        : selectedCategory === TaskCategory.Monthly
                          ? 'Monthly target'
                          : 'Yearly target'
                    }
                  </Text>
                )}
              </View>
            </View>
            <Ionicons 
              name={finishDate ? "close-circle" : "chevron-forward-outline"} 
              size={20} 
              color={finishDate ? "#ef4444" : "#94a3b8"}
              onPress={finishDate ? () => setFinishDate('') : undefined} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Mobile action button (Only shown on small screens) */}
        <View className="mb-6 md:hidden">
          <TouchableOpacity
            onPress={handleCreateTask}
            disabled={loading || !taskContent.trim()}
            className={`rounded-xl py-4 px-4 items-center shadow-md ${
              loading || !taskContent.trim() ? 'bg-gray-300' : 'bg-blue-500'
            }`}
            style={{ 
              shadowColor: '#000', 
              shadowOffset: { width: 0, height: 2 }, 
              shadowOpacity: 0.1, 
              shadowRadius: 4,
              elevation: 3 
            }}
          >
            {loading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white font-bold text-lg">Create Task</Text>
            )}
          </TouchableOpacity>
        
          {!taskContent.trim() && (
            <Text className="text-center text-red-400 text-xs mt-2">
              Please enter a task description
            </Text>
          )}
        </View>
        
        {/* Info Text */}
        {!isPrivate && (
          <View className="mb-8 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <View className="flex-row items-start">
              <Ionicons name="information-circle" size={22} color="#3b82f6" style={{ marginRight: 10, marginTop: 1 }} />
              <Text className="text-blue-800 flex-1">
                This task will be visible to your buddy, allowing them to track progress together with you.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Year Picker Modal */}
      <Modal
        visible={showYearPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowYearPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-2xl w-full max-h-96 overflow-hidden shadow-xl">
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              className="py-4 px-5"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-bold text-lg">Select Year</Text>
                <TouchableOpacity 
                  onPress={() => setShowYearPicker(false)}
                  className="bg-white/30 rounded-full p-1.5"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => handleYearSelect(item)}
                  className={`py-4 px-6 border-b border-gray-100 ${
                    finishDate && new Date(finishDate).getFullYear() === item
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <Text 
                    className={`text-base ${
                      finishDate && new Date(finishDate).getFullYear() === item
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          </View>
        </View>
      </Modal>
      
      {/* Month Picker Modal */}
      <Modal
        visible={showMonthPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMonthPicker(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-2xl w-full max-h-96 overflow-hidden shadow-xl">
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              className="py-4 px-5"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-bold text-lg">Select Month</Text>
                <TouchableOpacity 
                  onPress={() => setShowMonthPicker(false)}
                  className="bg-white/30 rounded-full p-1.5"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            
            <FlatList
              data={months}
              keyExtractor={(item) => item}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => handleMonthSelect(index)}
                  className={`py-4 px-6 border-b border-gray-100 ${
                    finishDate && new Date(finishDate).getMonth() === index
                      ? 'bg-blue-50'
                      : ''
                  }`}
                >
                  <Text 
                    className={`text-base ${
                      finishDate && new Date(finishDate).getMonth() === index
                        ? 'text-blue-600 font-semibold'
                        : 'text-gray-700'
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 8 }}
            />
          </View>
        </View>
      </Modal>
      
      {/* Calendar Modal for Daily/Weekly tasks */}
      <Modal
        visible={calendarVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setCalendarVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center p-5">
          <View className="bg-white rounded-2xl w-full overflow-hidden shadow-xl">
            <LinearGradient
              colors={['#3b82f6', '#1d4ed8']}
              className="py-4 px-5"
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-bold text-lg">Select Finish Date</Text>
                <TouchableOpacity 
                  onPress={() => setCalendarVisible(false)}
                  className="bg-white/30 rounded-full p-1.5"
                >
                  <Ionicons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
            
            <Calendar
              onDayPress={(day) => {
                setFinishDate(day.dateString);
                setCalendarVisible(false);
              }}
              markedDates={finishDate ? {[finishDate]: {selected: true, selectedColor: '#3b82f6'}} : {}}
              minDate={new Date().toISOString().split('T')[0]}
              theme={{
                calendarBackground: '#ffffff',
                textSectionTitleColor: '#64748b',
                selectedDayBackgroundColor: '#3b82f6',
                selectedDayTextColor: '#ffffff',
                todayTextColor: '#3b82f6',
                dayTextColor: '#334155',
                textDisabledColor: '#cbd5e1',
                dotColor: '#3b82f6',
                selectedDotColor: '#ffffff',
                arrowColor: '#3b82f6',
                monthTextColor: '#334155',
                textMonthFontWeight: 'bold',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14
              }}
            />
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
} 