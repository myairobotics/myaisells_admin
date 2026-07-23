import type {
  GetNotificationsResponse,
  GetUnreadNotificationCountResponse,
  MarkAllNotificationsReadResponse,
  MarkNotificationReadResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const notificationsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getNotifications: builder.query<GetNotificationsResponse, { page?: number; limit?: number; unreadOnly?: boolean }>({
      query: ({ page = 1, limit = 15, unreadOnly } = {}) => ({
        url: `${baseUrl}/notifications`,
        params: { page, limit, ...(unreadOnly && { unreadOnly }) },
      }),
      providesTags: ['Notification'],
    }),

    getUnreadNotificationCount: builder.query<GetUnreadNotificationCountResponse, void>({
      query: () => ({ url: `${baseUrl}/notifications/unread-count` }),
      providesTags: ['Notification'],
    }),

    markNotificationRead: builder.mutation<MarkNotificationReadResponse, string>({
      query: id => ({
        url: `${baseUrl}/notifications/${id}/read`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),

    markAllNotificationsRead: builder.mutation<MarkAllNotificationsReadResponse, void>({
      query: () => ({
        url: `${baseUrl}/notifications/read-all`,
        method: 'POST',
      }),
      invalidatesTags: ['Notification'],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useLazyGetNotificationsQuery,
  useGetUnreadNotificationCountQuery,
  useLazyGetUnreadNotificationCountQuery,
  useMarkNotificationReadMutation,
  useMarkAllNotificationsReadMutation,
} = notificationsApi;
