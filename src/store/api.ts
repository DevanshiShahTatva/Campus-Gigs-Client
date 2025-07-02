import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getAuthToken } from '@/utils/helper';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
    prepareHeaders: (headers) => {
      // Use the same logic as apiCall to get the token
      const token = getAuthToken();
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => '/user/profile',
    }),
    // Add more endpoints here
  }),
});

export const { useGetUserProfileQuery } = api; 