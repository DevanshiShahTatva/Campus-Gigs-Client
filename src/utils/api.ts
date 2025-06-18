import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { toast } from "react-toastify";
import { getAuthToken, logout } from './helper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    if (typeof window !== 'undefined') {
      const token: string | null = getAuthToken();
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.warn('Request timed out!');
    }

    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        logout();
        window.location.href = '/login';
      }
    }

    if (error.response?.status === 404) {
      toast.error(error.response.data.message);
    }

    if (error.response?.status === 400) {
      toast.error(error.response.data.message);
    }

    return Promise.reject(error);
  }
);

export default api;