import {axiosInstance} from '@/api/axiosInstance';
import {IBuddyRequest} from '@/types/buddyRequest';

export const sendBuddyRequest = async (
    token: string,
    userId: string,
    type: 'buddy' | 'follower'
): Promise<IBuddyRequest> => {
  const response = await axiosInstance.post(
      '/user/buddy-request/send',
      {userId, type},
      {headers: {Authorization: `Bearer ${token}`}}
  );
  return response.data.data.request;
};

export const acceptBuddyRequest = async (token: string, requestId: string): Promise<void> => {
  await axiosInstance.post(
      '/user/buddy-request/accept',
      {requestId},
      {headers: {Authorization: `Bearer ${token}`}}
  );
};

export const rejectBuddyRequest = async (token: string, requestId: string): Promise<void> => {
  await axiosInstance.post(
      '/user/buddy-request/reject',
      {requestId},
      {headers: {Authorization: `Bearer ${token}`}}
  );
};

export const cancelBuddyRequest = async (token: string, requestId: string): Promise<void> => {
  await axiosInstance.post(
      '/user/buddy-request/cancel',
      {requestId},
      {headers: {Authorization: `Bearer ${token}`}}
  );
};

export const getSentRequests = async (token: string): Promise<IBuddyRequest[]> => {
  const response = await axiosInstance.get('/user/buddy-request/sent', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.data.requests || [];
};

export const getReceivedRequests = async (token: string): Promise<IBuddyRequest[]> => {
  const response = await axiosInstance.get('/user/buddy-request/received', {
    headers: {Authorization: `Bearer ${token}`},
  });
  return response.data.data.requests || [];
};