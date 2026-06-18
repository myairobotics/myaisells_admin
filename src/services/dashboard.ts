import type { GetDashboardOverviewResponse } from '@/types';
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
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useLazyGetDashboardOverviewQuery,
} = dashboardApi;
