import React, {useState} from 'react';
import {Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {useRouter} from 'expo-router';
import {loginUserThunk} from '@/redux/thunks/authThunks';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {ThunkDispatch} from "redux-thunk";
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';


export default function Login() {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading] = useState(false);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await dispatch(loginUserThunk({identifier, password})).unwrap();
            router.replace('../../(tabs)');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <StatusBar style="light"/>
            <LinearGradient
                colors={['#4c669f', '#3b5998', '#192f6a']}
                className="absolute w-full h-full"
            />

            <ScrollView contentContainerStyle={{flexGrow: 1}}>
                <View className="flex-1 justify-between p-6">
                    {/* Header Section */}
                    <View className="items-center mt-12 mb-8">
                        <View className="bg-white/20 p-4 rounded-full mb-4">
                            <Ionicons name="person" size={40} color="white"/>
                        </View>
                        <Text className="text-white text-3xl font-bold">Welcome Back</Text>
                        <Text className="text-white/80 text-base mt-2">Sign in to continue</Text>
                    </View>

                    {/* Form Section */}
                    <View className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg">
                        <View className="bg-white/20 rounded-xl px-4 py-2 mb-4 flex-row items-center">
                            <Ionicons name="mail-outline" size={20} color="white" className="mr-2"/>
                            <Input
                                placeholder="Email or Username"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                value={identifier}
                                onChangeText={setIdentifier}
                                className="flex-1 text-white pl-2 h-12"
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="bg-white/20 rounded-xl px-4 py-2 mb-6 flex-row items-center">
                            <Ionicons name="lock-closed-outline" size={20} color="white" className="mr-2"/>
                            <Input
                                placeholder="Password"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                className="flex-1 text-white pl-2 h-12"
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility}>
                                <Ionicons
                                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>

                        <Button
                            title={isLoading ? "Log In..." : "Sign In"}
                            onPress={handleLogin}
                        />
                    </View>

                    {/* Footer Section */}
                    <View className="items-center mt-8 mb-6">
                        <Text className="text-white text-center mb-2">
                            Don't have an account?{' '}
                            <Text
                                className="font-bold underline"
                                onPress={() => router.push('./register')}
                            >
                                Register
                            </Text>
                        </Text>
                        <Text className="text-white/60 text-xs mt-6">
                            By continuing, you agree to our Terms of Service and Privacy Policy
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}