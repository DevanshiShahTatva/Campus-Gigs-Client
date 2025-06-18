import api from './api';
import { getAuthToken } from './helper';

export interface IRequestParams {
  endPoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | FormData | string | Blob | ArrayBuffer | null;
  withToken?: boolean;
  isFormData?: boolean;
}

export const apiCall = async ({
  endPoint,
  method,
  headers = { "Content-Type": "application/json" },
  body,
  withToken = true,
  isFormData = false,
}: IRequestParams) => {
  try {
    const finalHeaders: Record<string, string> = {
      ...headers,
    };

    if (withToken && typeof window !== 'undefined') {
      const token = getAuthToken();
      if (token) {
        finalHeaders['token'] = `${token}`;
      }
    }

    const config = {
      url: endPoint,
      method,
      headers: finalHeaders,
      data: isFormData ? body : JSON.stringify(body),
    };

    const response = await api(config);
    return response.data;

  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
};