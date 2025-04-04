import {Text, View} from 'react-native';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'expo-router';
import {registerThunk} from '@/redux/thunks/authThunks';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {ThunkDispatch} from "redux-thunk";

export default function Register() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const router = useRouter();

  const handleRegister = async () => {
    try {
      const user = await dispatch(registerThunk({
        name,
        username,
        password,
        mobile
      })).unwrap();
      router.push({
        pathname: '/auth/verify-otp',
        params: {username: user.username}
      });
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
      <View className="flex-1 justify-center p-4">
        <Text className="text-2xl mb-4">Register</Text>
        <Input placeholder="Name" value={name} onChangeText={setName}/>
        <Input placeholder="Username" value={username}
               onChangeText={setUsername}/>
        <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />
        <Input placeholder="Mobile" value={mobile} onChangeText={setMobile}/>
        <Button title="Register" onPress={handleRegister}/>
        <Text className="text-center mt-2">
          Already have an account?{' '}
          <Text className="text-blue-500"
                onPress={() => router.push('/auth/login')}>
            Login
          </Text>
        </Text>
      </View>
  );
}