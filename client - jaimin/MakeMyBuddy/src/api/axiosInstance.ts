import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Create axios instance with base URL
export const api = axios.create({
  baseURL: 'https://api.makeymybuddy.com/api', // Replace with your API URL
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Get token from storage
    const token = await AsyncStorage.getItem('authToken');

    // If token exists, add it to the headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (not needed with long-lived token approach, but good practice)
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      // Redirect to login
      // This would typically be handled by navigation/router
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);