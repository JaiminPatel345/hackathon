import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { setUserGoal } from '../../redux/slices/userSlice';
import { Picker } from '@react-native-picker/picker';
import { UserGoal } from '../../types/user';
import Colors from '../../constants/Colors';

export default function GoalSetupScreen() {
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [level, setLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Intermediate');
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async () => {
    if (!title || !target || !year) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const goalData: UserGoal = {
      title,
      target,
      year,
      level
    };

    setIsLoading(true);
    try {
      await dispatch(setUserGoal(goalData)).unwrap();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Failed to Set Goal', typeof error === 'string' ? error : 'An error occurred while setting your goal');
    } finally {
      setIsLoading(false);
    }
  };

  const years = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() + i).toString());

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-8 pt-12">
          <View className="items-center mb-8">
            <Text className="text-2xl font-bold text-blue-600">Set Your Study Goal</Text>
            <Text className="text-gray-500 mt-1 text-center">Tell us what you're working towards to find the perfect study buddy</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-1 font-medium">Goal Title</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
                placeholder="e.g. JEE Main, NEET, CAT"
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-1 font-medium">Target</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
                placeholder="e.g. Rank under 3 digits"
                value={target}
                onChangeText={setTarget}
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-1 font-medium">Target Year</Text>
              <View className="bg-gray-100 rounded-lg px-2 py-1">
                <Picker
                  selectedValue={year}
                  onValueChange={(itemValue) => setYear(itemValue.toString())}
                >
                  {years.map((yearOption) => (
                    <Picker.Item key={yearOption} label={yearOption} value={yearOption} />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-1 font-medium">Your Current Level</Text>
              <View className="bg-gray-100 rounded-lg px-2 py-1">
                <Picker
                  selectedValue={level}
                  onValueChange={(itemValue) => setLevel(itemValue as 'Beginner' | 'Intermediate' | 'Advanced')}
                >
                  <Picker.Item label="Beginner" value="Beginner" />
                  <Picker.Item label="Intermediate" value="Intermediate" />
                  <Picker.Item label="Advanced" value="Advanced" />
                </Picker>
              </View>
            </View>

            <TouchableOpacity
              className={`rounded-lg py-4 items-center mt-6 ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-medium text-lg">Continue</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4 items-center"
              onPress={() => router.replace('/(tabs)')}
            >
              <Text className="text-gray-500">Skip for now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}