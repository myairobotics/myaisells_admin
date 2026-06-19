import type { GetSalesAgentsResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const salesAgentsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAdminSalesAgents: builder.query<GetSalesAgentsResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 15, status, search } = {}) => ({
        url: `${baseUrl}/sales-agents`,
        params: { page, limit, ...(status && { status }), ...(search && { search }) },
      }),
      providesTags: ['SalesAgent'],
    }),
  }),
});

export const {
  useGetAdminSalesAgentsQuery,
  useLazyGetAdminSalesAgentsQuery,
} = salesAgentsApi;
