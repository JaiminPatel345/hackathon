import axios from 'axios';
import {getToken} from '@/services/authService';

const BASE_URL = '${EXPO_PUBLIC_BASE_URL}';

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to automatically add auth token
axiosInstance.interceptors.request.use(
    async (config) => {
        // Try to get token from secure storage
        const token = await getToken();

        // If token exists, add to headers
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);