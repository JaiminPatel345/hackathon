import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { loginUser } from '../../redux/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Login Failed', typeof error === 'string' ? error : 'Please check your credentials and try again');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 justify-center px-8 pt-12">
          <View className="items-center mb-10">
            <Image
              source={require('../../assets/images/icon.png')}
              className="w-20 h-20 mb-4"
            />
            <Text className="text-3xl font-bold text-blue-600">Make My Buddy</Text>
            <Text className="text-gray-500 mt-2">Find your perfect study partner</Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-1 font-medium">Email</Text>
              <TextInput
                className="bg-gray-100 rounded-lg px-4 py-3 text-gray-800"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-1 font-medium">Password</Text>
              <View className="flex-row bg-gray-100 rounded-lg px-4 py-3 items-center">
                <TextInput
                  className="flex-1 text-gray-800"
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={24}
                    color={Colors.gray}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className={`rounded-lg py-4 items-center mt-4 ${isLoading ? 'bg-blue-400' : 'bg-blue-600'}`}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text className="text-white font-medium text-lg">Login</Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                <Text className="text-blue-600 font-medium">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}