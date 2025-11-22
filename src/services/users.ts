import type {
  GetAppointmentMetricsResponse,
  GetCampaignConversationMetricsResponse,
  GetCampaignsMetricsResponse,
  GetPaymentsHistoryResponse,
  GetSubscriptionMetricResponse,
  GetUpgradeOrDowngradeMetricsResponse,
  GetUserCountMetricsResponse,
  GetUsersByCountryResponse,
  GetViewUsersResponse,
  UpdateUserStatusRequest,
  UpdateUserStatusResponse,
} from '@/types';

import { getBaseUrl } from '@/utils/Helpers';
import { baseApi } from '../store/api/baseApi';

const baseUrl = getBaseUrl('/a');

export const metrics = baseApi.injectEndpoints({
  endpoints: builder => ({
    getUserCountMetrics: builder.query<GetUserCountMetricsResponse, void>({
      query: () => ({
        url: `${baseUrl}/metrics/users-count`,
      }),
    }),

    getSubscriptionsMetrics: builder.query<GetSubscriptionMetricResponse, void>({
      query: () => ({
        url: `${baseUrl}/metrics/subscriptions`,
      }),
    }),

    getUsersByCountry: builder.query<GetUsersByCountryResponse, void>({
      query: () => ({
        url: `${baseUrl}/metrics/users-by-country`,
      }),
    }),

    getCampaignsMetrics: builder.query<GetCampaignsMetricsResponse, void>({
      query: () => ({
        url: `${baseUrl}/metrics/campaigns`,
      }),
    }),

    getCampaignConversationMetrics: builder.query<GetCampaignConversationMetricsResponse, void>({
      query: () => ({
        url: `${baseUrl}/metrics/conversations`,
      }),
    }),

    getAppointmentMetrics: builder.query<GetAppointmentMetricsResponse, void>({
      query: () => ({
        url: `${baseUrl}/metrics/appointments`,
      }),
    }),

    getUpgradeOrDowngradeMetrics: builder.query<GetUpgradeOrDowngradeMetricsResponse, void>({
      query: () => ({
        url: `${baseUrl}/metrics/downgrade-upgrade`,
      }),
    }),

    getViewUsers: builder.query<GetViewUsersResponse, string>({
      query: () => ({
        url: `${baseUrl}/users`,
      }),
    }),

    updateUserStatus: builder.mutation<
      UpdateUserStatusResponse,
      UpdateUserStatusRequest
    >({
      query: body => ({
        url: `${baseUrl}/user-status-update`,
        method: 'POST',
        body,
      }),
    }),

    getPaymentsHistory: builder.query<GetPaymentsHistoryResponse, string>({
      query: () => ({
        url: `${baseUrl}/payment`,
      }),
    }),
  }),
});

export const {
  useGetUserCountMetricsQuery,
  useLazyGetUserCountMetricsQuery,

  useGetSubscriptionsMetricsQuery,
  useLazyGetSubscriptionsMetricsQuery,

  useGetUsersByCountryQuery,
  useLazyGetUsersByCountryQuery,

  useGetCampaignsMetricsQuery,
  useLazyGetCampaignsMetricsQuery,

  useGetCampaignConversationMetricsQuery,
  useLazyGetCampaignConversationMetricsQuery,

  useGetAppointmentMetricsQuery,
  useLazyGetAppointmentMetricsQuery,

  useGetUpgradeOrDowngradeMetricsQuery,
  useLazyGetUpgradeOrDowngradeMetricsQuery,

  useGetViewUsersQuery,
  useLazyGetViewUsersQuery,

  useUpdateUserStatusMutation,

  useGetPaymentsHistoryQuery,
  useLazyGetPaymentsHistoryQuery,
} = metrics;
