import React, {useState} from 'react';
import {Text, View, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useDispatch} from 'react-redux';
import {useRouter} from 'expo-router';
import {registerUserThunk} from '@/redux/thunks/authThunks';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {ThunkDispatch} from "redux-thunk";
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';

export default function Register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mobile, setMobile] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const router = useRouter();

    const handleRegister = async () => {
        // Basic validation
        if (!name || !username || !password || !mobile) {
            // Could add more sophisticated validation here
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(registerUserThunk({
                name,
                username,
                password,
                mobile
            })).unwrap();

            router.push(`./verify-otp?username=${username}`);
        } catch (error) {
            console.error('Registration failed:', error);
            // Could add error handling UI here
        } finally {
            setIsLoading(false);
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
                    <View className="items-center mt-8 mb-6">
                        <View className="bg-white/20 p-4 rounded-full mb-4">
                            <Ionicons name="person-add" size={40} color="white"/>
                        </View>
                        <Text className="text-white text-3xl font-bold">Create Account</Text>
                        <Text className="text-white/80 text-base mt-2">Join our community today</Text>
                    </View>

                    {/* Form Section */}
                    <View className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg">
                        <View className="bg-white/20 rounded-xl px-4 py-2 mb-4 flex-row items-center">
                            <Ionicons name="person-outline" size={20} color="white" className="mr-2"/>
                            <Input
                                placeholder="Full Name"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                value={name}
                                onChangeText={setName}
                                className="flex-1 text-white pl-2 h-12"
                            />
                        </View>

                        <View className="bg-white/20 rounded-xl px-4 py-2 mb-4 flex-row items-center">
                            <Ionicons name="at-outline" size={20} color="white" className="mr-2"/>
                            <Input
                                placeholder="Username"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                value={username}
                                onChangeText={setUsername}
                                className="flex-1 text-white pl-2 h-12"
                                autoCapitalize="none"
                            />
                        </View>

                        <View className="bg-white/20 rounded-xl px-4 py-2 mb-4 flex-row items-center">
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

                        <View className="bg-white/20 rounded-xl px-4 py-2 mb-6 flex-row items-center">
                            <Ionicons name="call-outline" size={20} color="white" className="mr-2"/>
                            <Input
                                placeholder="Mobile Number"
                                placeholderTextColor="rgba(255,255,255,0.6)"
                                value={mobile}
                                onChangeText={setMobile}
                                className="flex-1 text-white pl-2 h-12"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <Button
                            title={isLoading ? "Creating Account..." : "Create Account"}
                            onPress={handleRegister}
                            disabled={isLoading}
                            className="rounded-xl py-4  text-secondary-500 font-bold text-lg"
                        />

                        <View className="mt-4">
                            <Text className="text-white/80 text-center text-xs">
                                By registering, you confirm that you accept our{' '}
                                <Text className="underline">Terms of Service</Text> and{' '}
                                <Text className="underline">Privacy Policy</Text>
                            </Text>
                        </View>

                    </View>
                    {/* Footer Section */}
                    <View className="items-center mt-6 mb-4">
                        <Text className="text-white text-center">
                            Already have an account?{' '}
                            <Text
                                className="font-bold underline"
                                onPress={() => router.push('./login')}
                            >
                                Sign In
                            </Text>
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}