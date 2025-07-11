import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { store } from "@/redux";
import { ROUTES } from "./constant";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token: string | null = store.getState().user.token;
    if (token && config.headers) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    // Handle unauthorized error (401)
    if (error.response?.status === 401) {
      console.warn("Unauthorized - maybe redirect to login");
      if (typeof window !== 'undefined') {
        // Remove auth token
        localStorage.clear()
        sessionStorage.clear()
        Cookies.remove('token')
      }
      window.location.href = ROUTES.LOGIN;
    }
    return error?.response;
  }
);

export default api;
