import type {
  GetDashboardGrowthResponse,
  GetDashboardLeaderboardsResponse,
  GetDashboardOverviewResponse,
  GetDashboardSummaryResponse,
  GetDashboardSupportActivityResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getDashboardOverview: builder.query<GetDashboardOverviewResponse, void>({
      query: () => ({
        url: `${baseUrl}/dashboard/overview`,
      }),
    }),

    getDashboardSummary: builder.query<GetDashboardSummaryResponse, void>({
      query: () => ({
        url: `${baseUrl}/dashboard/summary`,
      }),
    }),

    getDashboardLeaderboards: builder.query<GetDashboardLeaderboardsResponse, void>({
      query: () => ({
        url: `${baseUrl}/dashboard/leaderboards`,
      }),
    }),

    getDashboardGrowth: builder.query<GetDashboardGrowthResponse, void>({
      query: () => ({
        url: `${baseUrl}/dashboard/growth`,
      }),
    }),

    getDashboardSupportActivity: builder.query<GetDashboardSupportActivityResponse, void>({
      query: () => ({
        url: `${baseUrl}/dashboard/support-activity`,
      }),
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useLazyGetDashboardOverviewQuery,
  useGetDashboardSummaryQuery,
  useLazyGetDashboardSummaryQuery,
  useGetDashboardLeaderboardsQuery,
  useLazyGetDashboardLeaderboardsQuery,
  useGetDashboardGrowthQuery,
  useLazyGetDashboardGrowthQuery,
  useGetDashboardSupportActivityQuery,
  useLazyGetDashboardSupportActivityQuery,
} = dashboardApi;
