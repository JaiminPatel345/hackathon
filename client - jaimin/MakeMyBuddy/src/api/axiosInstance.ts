import axios from 'axios';

const BASE_URL = 'http://192.168.143.167:4000';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});