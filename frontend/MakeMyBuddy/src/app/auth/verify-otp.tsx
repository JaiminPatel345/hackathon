import React, {useState, useEffect, useRef} from 'react';
import {Text, View, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {useDispatch} from 'react-redux';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {verifyUserOtpThunk} from '@/redux/thunks/authThunks';
import Button from '@/components/Button';
import {ThunkDispatch} from "redux-thunk";
import {Ionicons} from '@expo/vector-icons';
import {StatusBar} from 'expo-status-bar';
import {LinearGradient} from 'expo-linear-gradient';

export default function VerifyOtp() {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const router = useRouter();
    const {username} = useLocalSearchParams();

    // Create ref for each input field
    const inputRefs = useRef<Array<TextInput | null>>([null, null, null, null]);

    useEffect(() => {
        // Timer for OTP resend
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prevTime => prevTime - 1);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async () => {
        // Combine OTP digits
        const otpValue = otp.join('');

        if (otpValue.length !== 4) {
            // Could add error message here
            return;
        }

        setIsLoading(true);
        try {
            await dispatch(verifyUserOtpThunk({
                username: username as string,
                givenOtp: otpValue
            })).unwrap();
            router.replace(`/user/profileSetup`);
        } catch (error) {
            console.error('OTP verification failed:', error);
            // Could add error handling UI here
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpChange = (text: string, index: number) => {
        // Handle the case when the user pastes a multi-digit value
        if (text.length > 1) {
            // If a multi-digit text is pasted, distribute across fields
            const digits = text.split('').slice(0, 4);
            const newOtp = [...otp];

            digits.forEach((digit, idx) => {
                if (index + idx < 4) {
                    newOtp[index + idx] = digit;
                }
            });

            setOtp(newOtp);

            // Focus the appropriate field after pasting
            const nextIndex = Math.min(index + digits.length, 3);
            if (nextIndex < 4) {
                setTimeout(() => {
                    inputRefs.current[nextIndex]?.focus();
                }, 0);
            }
            return;
        }

        // Handle single digit input
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Move to next input when a digit is entered
        if (text && index < 3) {
            // Use setTimeout to ensure state is updated before focus change
            setTimeout(() => {
                inputRefs.current[index + 1]?.focus();
            }, 0);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Handle backspace to move to previous input
        if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
            setTimeout(() => {
                inputRefs.current[index - 1]?.focus();
            }, 0);
        }
    };

    const resendOtp = () => {
        // Would implement resend OTP functionality here
        setTimer(60);
        // Add API call to resend OTP
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
                <View className="flex-1 justify-center p-6">
                    {/* Header Section */}
                    <View className="items-center mb-8">
                        <View className="bg-white/20 p-4 rounded-full mb-4">
                            <Ionicons name="shield-checkmark" size={40} color="white"/>
                        </View>
                        <Text className="text-white text-3xl font-bold">Verification</Text>
                        <Text className="text-white/80 text-base mt-2 text-center">
                            We've sent a verification code to the mobile number associated with {username}
                        </Text>
                    </View>

                    {/* OTP Input Section */}
                    <View className="bg-white/10 rounded-3xl p-6 backdrop-blur-lg">
                        <Text className="text-white text-lg mb-6 text-center">
                            Enter 4-digit verification code
                        </Text>

                        <View className="flex-row justify-between mb-8">
                            {[0, 1, 2, 3].map((index) => (
                                <TextInput
                                    key={index}
                                    ref={(el) => {
                                        inputRefs.current[index] = el
                                    }}
                                    className="bg-white/20 w-16 h-16 rounded-xl text-white text-center text-2xl font-bold"
                                    maxLength={1}
                                    keyboardType="number-pad"
                                    value={otp[index]}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                    blurOnSubmit={false}
                                    selectTextOnFocus={true}
                                />
                            ))}
                        </View>

                        <Button
                            title={isLoading ? "Verifying..." : "Verify & Continue"}
                            onPress={handleVerify}
                            disabled={isLoading || otp.join('').length !== 4}
                            className="rounded-xl py-4 mb-6 text-blue-800 font-bold text-lg"
                        />

                        <View className="items-center">
                            <Text className="text-white/80 text-center mb-2">
                                Didn't receive code?
                            </Text>

                            {timer > 0 ? (
                                <Text className="text-white/60">
                                    Resend code in {timer} seconds
                                </Text>
                            ) : (
                                <TouchableOpacity onPress={resendOtp}>
                                    <Text className="text-white font-bold">Resend Code</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Help Section */}
                    <View className="items-center mt-8">
                        <TouchableOpacity
                            className="flex-row items-center"
                            onPress={() => router.push('./support')}
                        >
                            <Ionicons name="help-circle-outline" size={20} color="white"/>
                            <Text className="text-white ml-2">Need help?</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}