import {axiosInstance} from '@/api/axiosInstance';
import {IUser} from '@/types/user';
import { saveAuthData } from '@/services/authService';

interface LoginResponse {
  success: boolean;
  message: string;
  data: { user: IUser; token: string };
}

export const login = async (identifier: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', { identifier, password });
  // Save auth data
  if (response.data.success) {
    await saveAuthData(response.data.data.token, response.data.data.user);
  }
  return response.data;
};

export const register = async (
  name: string,
  username: string,
  password: string,
  mobile: string
): Promise<{ success: boolean; message: string; data: { user: IUser } }> => {
  const response = await axiosInstance.post('/auth/register', { name, username, password, mobile });
  return response.data;
};

export const verifyOtp = async (
  username: string,
  givenOtp: string
): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/verify-otp', { username, givenOtp });
  // Save auth data
  if (response.data.success) {
    await saveAuthData(response.data.data.token, response.data.data.user);
  }
  return response.data;
};