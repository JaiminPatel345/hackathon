import {Redirect, Stack} from 'expo-router';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux/store';

export default function AuthLayout() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // If already authenticated, redirect to home
  if (isAuthenticated) {
    return <Redirect href="/"/>;
  }

  return (
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="login"/>
        <Stack.Screen name="register"/>
        <Stack.Screen name="verify-otp"/>
      </Stack>
  );
}