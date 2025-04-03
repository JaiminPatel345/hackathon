// src/api/resource.api.ts
import axiosInstance from './axiosInstance';
import { Resource } from '../types/resource';

export const getResources = async () => {
  const response = await axiosInstance.get('/resources');
  return response.data;
};

export const addResource = async (formData: FormData) => {
  const response = await axiosInstance.post('/resources', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteResource = async (resourceId: string) => {
  const response = await axiosInstance.delete(`/resources/${resourceId}`);
  return response.data;
};