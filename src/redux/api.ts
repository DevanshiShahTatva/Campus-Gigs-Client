import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from './index';

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "",
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.user?.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => "/user/profile",
    }),
    getProviderPublicProfile: builder.query<any, string>({
      query: (id: string) => `/user/profile/public/${id}`,
    }),
    // Add more endpoints here
  }),
});

export const { useGetUserProfileQuery, useGetProviderPublicProfileQuery } = api;
