import { useSelector } from 'react-redux';
import { Redirect, Slot } from 'expo-router';
import { RootState } from '@/redux/store';

export default function RootLayout() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Redirect href="/auth/login" />;
  }

  return <Slot />;
}