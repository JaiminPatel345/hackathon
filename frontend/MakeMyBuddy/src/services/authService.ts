import * as SecureStore from 'expo-secure-store';
import { IUser } from '@/types/user';

// Key for storing token
const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// Save token to secure storage
export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

// Get token from secure storage
export const getToken = async (): Promise<string | null> => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

// Delete token from secure storage
export const deleteToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

// Save user data
export const saveUser = async (user: IUser): Promise<void> => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

// Get user data
export const getUser = async (): Promise<IUser | null> => {
  const userData = await SecureStore.getItemAsync(USER_KEY);
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

// Delete user data
export const deleteUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(USER_KEY);
};

// Save auth data (both token and user)
export const saveAuthData = async (token: string, user: IUser): Promise<void> => {
  await Promise.all([saveToken(token), saveUser(user)]);
};

// Delete auth data (both token and user)
export const clearAuthData = async (): Promise<void> => {
  await Promise.all([deleteToken(), deleteUser()]);
}; 