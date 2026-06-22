import type { GetTokenAllocationsResponse, GetTokenTransactionsResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const tokensApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTokenAllocations: builder.query<GetTokenAllocationsResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 15, search } = {}) => ({
        url: `${baseUrl}/tokens/allocations`,
        params: { page, limit, ...(search && { search }) },
      }),
      providesTags: ['Token'],
    }),
    getTokenTransactions: builder.query<GetTokenTransactionsResponse, { businessId?: string; page?: number; limit?: number }>({
      query: ({ businessId, page = 1, limit = 20 } = {}) => ({
        url: `${baseUrl}/tokens/transactions`,
        params: { page, limit, ...(businessId && { business_id: businessId }) },
      }),
      providesTags: ['Token'],
    }),
  }),
});

export const {
  useGetTokenAllocationsQuery,
  useGetTokenTransactionsQuery,
  useLazyGetTokenTransactionsQuery,
} = tokensApi;
