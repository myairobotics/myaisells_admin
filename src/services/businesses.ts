import type { GetAdminBusinessesResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const businessesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAdminBusinesses: builder.query<GetAdminBusinessesResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 15, status, search } = {}) => ({
        url: `${baseUrl}/businesses`,
        params: { page, limit, ...(status && { status }), ...(search && { search }) },
      }),
      providesTags: ['Business'],
    }),
  }),
});

export const {
  useGetAdminBusinessesQuery,
  useLazyGetAdminBusinessesQuery,
} = businessesApi;
