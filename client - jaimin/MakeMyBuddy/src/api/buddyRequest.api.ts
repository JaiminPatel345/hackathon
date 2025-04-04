import {axiosInstance} from '@/api/axiosInstance';
import {IBuddyRequest} from '@/types/buddyRequest';

// Get all sent buddy requests
export const getSentRequests = async (): Promise<IBuddyRequest[]> => {
  const response = await axiosInstance.get('/buddy-request/sent');
  return response.data.data;
};

// Get all received buddy requests
export const getReceivedRequests = async (): Promise<IBuddyRequest[]> => {
  const response = await axiosInstance.get('/buddy-request/received');
  return response.data.data;
};

// Send a buddy request
export const sendBuddyRequest = async (
    recipientId: string,
    type: string,
    message?: string
): Promise<IBuddyRequest> => {
  const response = await axiosInstance.post('/buddy-request/send', {
    recipientId,
    type,
    message
  });
  return response.data.data;
};

// Accept a buddy request
export const acceptBuddyRequest = async (requestId: string): Promise<IBuddyRequest> => {
  const response = await axiosInstance.put(`/buddy-request/accept/${requestId}`);
  return response.data.data;
};

// Reject a buddy request
export const rejectBuddyRequest = async (requestId: string): Promise<IBuddyRequest> => {
  const response = await axiosInstance.put(`/buddy-request/reject/${requestId}`);
  return response.data.data;
};

// Cancel a buddy request
export const cancelBuddyRequest = async (requestId: string): Promise<IBuddyRequest> => {
  const response = await axiosInstance.put(`/buddy-request/cancel/${requestId}`);
  return response.data.data;
};