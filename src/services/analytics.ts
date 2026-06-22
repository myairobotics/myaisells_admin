import type { AnalyticsPeriod, GetAnalyticsOverviewResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const analyticsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAnalyticsOverview: builder.query<GetAnalyticsOverviewResponse, { period?: AnalyticsPeriod }>({
      query: ({ period = '30d' } = {}) => ({
        url: `${baseUrl}/analytics/overview`,
        params: { period },
      }),
    }),
  }),
});

export const {
  useGetAnalyticsOverviewQuery,
  useLazyGetAnalyticsOverviewQuery,
} = analyticsApi;
