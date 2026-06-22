import type { GetSupportSessionsResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const supportApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSupportSessions: builder.query<GetSupportSessionsResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 15, status, search } = {}) => ({
        url: `${baseUrl}/support-access/sessions`,
        params: { page, limit, ...(status && { status }), ...(search && { search }) },
      }),
      providesTags: ['SupportSession'],
    }),
    terminateSupportSession: builder.mutation<{ success: boolean }, string>({
      query: sessionId => ({
        url: `${baseUrl}/support-access/sessions/${sessionId}/terminate`,
        method: 'POST',
      }),
      invalidatesTags: ['SupportSession'],
    }),
  }),
});

export const {
  useGetSupportSessionsQuery,
  useTerminateSupportSessionMutation,
} = supportApi;
