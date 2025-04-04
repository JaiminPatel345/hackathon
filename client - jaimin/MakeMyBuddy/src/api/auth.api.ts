import {axiosInstance} from '@/api/axiosInstance';
import {IUser} from '@/types/user';

interface LoginResponse {
  success: boolean;
  message: string;
  data: { user: IUser; token: string };
}

export const login = async (identifier: string, password: string): Promise<LoginResponse> => {
  const response = await axiosInstance.post('/auth/login', { identifier, password });
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
  return response.data;
};