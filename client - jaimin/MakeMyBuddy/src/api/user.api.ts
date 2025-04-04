import {axiosInstance} from '@/api/axiosInstance';
import {IUser} from '@/types/user';

export const getMyProfile = async (token: string): Promise<IUser> => {
  const response = await axiosInstance.get('/user/me', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.data.user;
};

export const updateProfile = async (
    token: string,
    data: Partial<IUser>
): Promise<IUser> => {
  const response = await axiosInstance.put('/user/update-profile', data, {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.data.user;
};

export const getUserProfile = async (userId: string): Promise<IUser> => {
  const response = await axiosInstance.get(`/user/profile/${userId}`);
  return response.data.data.user;
};

export const toggleBlockUser = async (token: string, userId: string): Promise<void> => {
  await axiosInstance.post(
      '/user/toggle-block',
      {userId},
      {headers: {Authorization: `Bearer ${token}`}}
  );
};

export const removeBuddy = async (token: string): Promise<void> => {
  await axiosInstance.post('/user/remove-buddy', {}, {
    headers: {Authorization: `Bearer ${token}`},
  });
};

export const removeFromBuddies = async (token: string, userId: string): Promise<void> => {
  await axiosInstance.post('/user/remove-from-buddies', {userId}, {
    headers: {Authorization: `Bearer ${token}`},
  });
};