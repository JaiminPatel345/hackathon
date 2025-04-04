import {Text, View} from 'react-native';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useLocalSearchParams, useRouter} from 'expo-router';
import {verifyOtpThunk} from '@/redux/thunks/authThunks';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {ThunkDispatch} from "redux-thunk";

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const router = useRouter();
  const {username} = useLocalSearchParams();

  const handleVerify = async () => {
    try {
      await dispatch(verifyOtpThunk({
        username: username as string,
        givenOtp: otp
      })).unwrap();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('OTP verification failed:', error);
    }
  };

  return (
      <View className="flex-1 justify-center p-4">
        <Text className="text-2xl mb-4">Verify OTP</Text>
        <Text className="mb-4">Enter the OTP sent to your mobile</Text>
        <Input placeholder="OTP" value={otp} onChangeText={setOtp}/>
        <Button title="Verify" onPress={handleVerify}/>
      </View>
  );
}
