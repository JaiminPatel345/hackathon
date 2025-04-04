import {Text, View} from 'react-native';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useRouter} from 'expo-router';
import {loginThunk} from '@/redux/thunks/authThunks';
import Button from '@/components/Button';
import Input from '@/components/Input';
import {ThunkDispatch} from "redux-thunk";

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await dispatch(loginThunk({identifier, password})).unwrap();
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
      <View className="flex-1 justify-center p-4">
        <Text className="text-2xl mb-4">Login</Text>
        <Input
            placeholder="Username or Mobile"
            value={identifier}
            onChangeText={setIdentifier}
        />
        <Input
            placeholder="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
        />
        <Button title="Login" onPress={handleLogin}/>
        <Text className="text-center mt-2">
          Don't have an account?{' '}
          <Text
              className="text-blue-500"
              onPress={() => router.push('/auth/register')}
          >
            Register
          </Text>
        </Text>
      </View>
  );
}