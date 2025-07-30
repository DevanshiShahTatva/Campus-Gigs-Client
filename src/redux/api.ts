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
  tagTypes: ["UserProfile"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => "/user/profile",
      providesTags: ["UserProfile"],
    }),
    getProviderPublicProfile: builder.query<any, string>({
      query: (id: string) => `/user/profile/public/${id}`,
    }),
    updateUserProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/profile",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    getUserNotifications: builder.query<any, void>({
      query: () => "/notifications",
    }),
    markNotificationRead: builder.mutation<any, { notificationId: number }>({
      query: (body) => ({
        url: "/notifications/mark-read",
        method: "POST",
        body,
      }),
    }),
    markAllNotificationsRead: builder.mutation<any, void>({
      query: () => ({
        url: "/notifications/mark-all-read",
        method: "POST",
      }),
    }),
    updateNotificationPreferences: builder.mutation<
      any,
      { userId: any; preferences: any }
    >({
      query: ({ userId, preferences }) => ({
        url: `/user/${userId}/notification-preferences`,
        method: "PUT",
        body: preferences,
      }),
      invalidatesTags: ["UserProfile"],
    }),
    // Add more endpoints here
  }),
});

export const {
  useGetUserProfileQuery,
  useGetProviderPublicProfileQuery,
  useUpdateUserProfileMutation,
  useGetUserNotificationsQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
  useUpdateNotificationPreferencesMutation,
} = api;
