import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { getAuthToken } from "./helper";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token: string | null = getAuthToken();
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    return error?.response;
  }
);

export default api;
