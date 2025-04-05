import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Image, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { uploadImageToCloudinary } from '@/utils/cloudinaryUpload';
import { updateProfileThunk } from '@/redux/thunks/userThunks';
import { clearProfileUpdateStatus } from '@/redux/slices/authSlice';
import { RootState } from '@/redux/store';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';
import { IGoalLevel, UpdateProfileRequest } from '@/types/user';

const INTEREST_SUGGESTIONS = ['JEE', 'NEET', 'DSA', 'MERN'];
const LEVEL_OPTIONS = [IGoalLevel.BEGINNER, IGoalLevel.INTERMEDIATE, IGoalLevel.EXPERT];
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = CURRENT_YEAR;
const MAX_YEAR = CURRENT_YEAR + 20;

export default function ProfileSetup() {
  const router = useRouter();
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();
  const { profileUpdateLoading, profileUpdateSuccess, profileUpdateError } = useSelector(
    (state: RootState) => state.auth
  );

  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [interests, setInterests] = useState<string[]>([]);
  const [newInterest, setNewInterest] = useState('');  
  const [goal, setGoal] = useState({
    title: '',
    target: '',
    year: CURRENT_YEAR,
    level: IGoalLevel.BEGINNER
  });

  useEffect(() => {
    if (profileUpdateSuccess) {
      // Navigate to the next screen
      router.replace('../../(tabs)');
      dispatch(clearProfileUpdateStatus());
    }
  }, [profileUpdateSuccess, router, dispatch]);

  useEffect(() => {
    if (profileUpdateError) {
      Alert.alert('Error', profileUpdateError);
      dispatch(clearProfileUpdateStatus());
    }
  }, [profileUpdateError, dispatch]);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      setUploadError('Failed to select image');
    }
  };

  const uploadImage = async (uri: string) => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const cloudinaryUrl = await uploadImageToCloudinary(uri);
      setUploadedImageUrl(cloudinaryUrl);
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      setUploadError('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const incrementYear = () => {
    if (goal.year < MAX_YEAR) {
      setGoal({ ...goal, year: goal.year + 1 });
    }
  };

  const decrementYear = () => {
    if (goal.year > MIN_YEAR) {
      setGoal({ ...goal, year: goal.year - 1 });
    }
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      const formattedInterest = newInterest.trim().toUpperCase();
      if (!interests.includes(formattedInterest)) {
        setInterests([...interests, formattedInterest]);
      }
      setNewInterest('');
    }
  };

  const addSuggestedInterest = (interest: string) => {
    if (!interests.includes(interest)) {
      setInterests([...interests, interest]);
    }
  };

  const removeInterest = (interest: string) => {
    setInterests(interests.filter(item => item !== interest));
  };

  const handleLevelSelect = (level: IGoalLevel) => {
    setGoal({ ...goal, level });
  };

  const handleSaveProfile = () => {
    // Make sure we have the required data
    if (!goal.title || !goal.target) {
      Alert.alert('Missing Information', 'Please provide your goal title and target');
      return;
    }

    // Create the profile update payload
    const profileData: UpdateProfileRequest = {
      goal,
      interests,
    };

    // Add avatar if available
    if (uploadedImageUrl) {
      profileData.avatar = uploadedImageUrl;
    }

    // Dispatch the update profile thunk
    dispatch(updateProfileThunk(profileData));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <StatusBar style="light" />
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        className="absolute w-full h-full"
      />

      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-between p-6">
          {/* Header Section */}
          <View className="items-center mt-8 mb-6">
            <Text className="text-white text-3xl font-bold">Complete Your Profile</Text>
            <Text className="text-white/80 text-base mt-2">Tell us more about you</Text>
          </View>

          {/* Form Section */}
          <View className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg">
            {/* Profile Picture */}
            <View className="items-center mb-6">
              <TouchableOpacity 
                onPress={pickImage}
                disabled={isUploading} 
                className="mb-2 relative"
              >
                {profileImage ? (
                  <View>
                    <Image 
                      source={{ uri: profileImage }} 
                      className="w-24 h-24 rounded-full" 
                    />
                    {isUploading && (
                      <View className="absolute inset-0 bg-black/50 rounded-full items-center justify-center">
                        <ActivityIndicator size="large" color="#fff" />
                      </View>
                    )}
                  </View>
                ) : (
                  <View className="bg-white/20 w-24 h-24 rounded-full items-center justify-center">
                    <Ionicons name="person" size={40} color="white" />
                    <View className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full">
                      <Ionicons name="camera" size={16} color="white" />
                    </View>
                  </View>
                )}
              </TouchableOpacity>
              <Text className="text-white text-sm">
                {isUploading ? 'Uploading...' : 'Tap to upload profile picture'}
              </Text>
              {uploadError && (
                <Text className="text-red-400 text-xs mt-1">{uploadError}</Text>
              )}
              {uploadedImageUrl && !isUploading && (
                <Text className="text-green-400 text-xs mt-1">Upload successful</Text>
              )}
            </View>

            {/* Goal Section */}
            <Text className="text-white text-xl font-semibold mb-4">Your Goal</Text>
            
            <View className="bg-white/20 rounded-xl px-4 py-2 mb-4">
              <Text className="text-white/80 text-xs mb-1">Goal Title</Text>
              <Input
                placeholder="e.g. Become best in DSA"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={goal.title}
                onChangeText={(text) => setGoal({ ...goal, title: text })}
                className="text-white"
              />
            </View>

            <View className="bg-white/20 rounded-xl px-4 py-2 mb-4">
              <Text className="text-white/80 text-xs mb-1">Target</Text>
              <Input
                placeholder="e.g. Solve 600 leetcode problems"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={goal.target}
                onChangeText={(text) => setGoal({ ...goal, target: text })}
                className="text-white"
              />
            </View>

            <View className="bg-white/20 rounded-xl px-4 py-2 mb-4">
              <Text className="text-white/80 text-xs mb-1">Target Year</Text>
              <View className="flex-row items-center justify-between">
                <TouchableOpacity 
                  onPress={decrementYear}
                  disabled={goal.year <= MIN_YEAR}
                  className={`bg-blue-500 w-10 h-10 rounded-full items-center justify-center ${goal.year <= MIN_YEAR ? 'opacity-50' : ''}`}
                >
                  <Ionicons name="remove" size={24} color="white" />
                </TouchableOpacity>
                
                <View className="bg-white/20 px-8 py-3 rounded-xl">
                  <Text className="text-white text-xl font-bold text-center">{goal.year}</Text>
                </View>
                
                <TouchableOpacity 
                  onPress={incrementYear}
                  disabled={goal.year >= MAX_YEAR}
                  className={`bg-blue-500 w-10 h-10 rounded-full items-center justify-center ${goal.year >= MAX_YEAR ? 'opacity-50' : ''}`}
                >
                  <Ionicons name="add" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-white/80 text-xs mb-2">Your Level</Text>
              <View className="flex-row justify-between">
                {LEVEL_OPTIONS.map((level) => (
                  <TouchableOpacity 
                    key={level}
                    onPress={() => handleLevelSelect(level)}
                    className={`py-2 px-4 rounded-xl ${goal.level === level ? 'bg-blue-500' : 'bg-white/20'}`}
                  >
                    <Text className="text-white font-medium">{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Interests Section */}
            <Text className="text-white text-xl font-semibold mb-4">Your Interests</Text>
            
            <View className="bg-white/20 rounded-xl px-4 py-2 mb-4 flex-row items-center">
              <Input
                placeholder="Add your interests"
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={newInterest}
                onChangeText={setNewInterest}
                className="flex-1 text-white"
                autoCapitalize="characters"
              />
              <TouchableOpacity onPress={addInterest} className="ml-2 bg-blue-500 p-2 rounded-lg">
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Interest Suggestions */}
            <Text className="text-white/80 text-xs mb-2">Suggestions:</Text>
            <View className="flex-row flex-wrap mb-4">
              {INTEREST_SUGGESTIONS.map(suggestion => (
                <TouchableOpacity
                  key={suggestion}
                  onPress={() => addSuggestedInterest(suggestion)}
                  className={`m-1 py-1 px-3 rounded-lg ${
                    interests.includes(suggestion) ? 'bg-blue-500/50' : 'bg-white/20'
                  }`}
                >
                  <Text className="text-white">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Selected Interests */}
            {interests.length > 0 && (
              <View className="mb-6">
                <Text className="text-white/80 text-xs mb-2">Your interests:</Text>
                <View className="flex-row flex-wrap">
                  {interests.map(interest => (
                    <View key={interest} className="bg-blue-500 m-1 rounded-lg flex-row items-center px-3 py-1">
                      <Text className="text-white mr-1">{interest}</Text>
                      <TouchableOpacity onPress={() => removeInterest(interest)}>
                        <Ionicons name="close-circle" size={16} color="white" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <Button
              title={profileUpdateLoading ? "Saving..." : "Save Profile"}
              onPress={handleSaveProfile}
              className="mt-4"
              disabled={!!(isUploading || (profileImage && !uploadedImageUrl) || profileUpdateLoading)}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}