import type {
  BusinessActionResponse,
  CreateBusinessRequest,
  CreateBusinessResponse,
  GetAdminBusinessesResponse,
  GetAdminBusinessResponse,
  GetBusinessStatsResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const businessesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getBusinessStats: builder.query<GetBusinessStatsResponse, void>({
      query: () => ({ url: `${baseUrl}/businesses/stats` }),
      providesTags: ['Business'],
    }),

    getAdminBusinesses: builder.query<GetAdminBusinessesResponse, { page?: number; limit?: number; status?: string; search?: string }>({
      query: ({ page = 1, limit = 15, status, search } = {}) => ({
        url: `${baseUrl}/businesses`,
        params: { page, limit, ...(status && { status }), ...(search && { search }) },
      }),
      providesTags: ['Business'],
    }),

    getAdminBusiness: builder.query<GetAdminBusinessResponse, string>({
      query: id => ({ url: `${baseUrl}/businesses/${id}` }),
      providesTags: ['Business'],
    }),

    createBusiness: builder.mutation<CreateBusinessResponse, CreateBusinessRequest>({
      query: body => ({
        url: `${baseUrl}/businesses`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Business'],
    }),

    activateBusiness: builder.mutation<BusinessActionResponse, string>({
      query: id => ({
        url: `${baseUrl}/businesses/${id}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Business'],
    }),

    suspendBusiness: builder.mutation<BusinessActionResponse, string>({
      query: id => ({
        url: `${baseUrl}/businesses/${id}/suspend`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Business'],
    }),

    cancelBusiness: builder.mutation<BusinessActionResponse, string>({
      query: id => ({
        url: `${baseUrl}/businesses/${id}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Business'],
    }),
  }),
});

export const {
  useGetBusinessStatsQuery,
  useLazyGetBusinessStatsQuery,

  useGetAdminBusinessesQuery,
  useLazyGetAdminBusinessesQuery,

  useGetAdminBusinessQuery,
  useLazyGetAdminBusinessQuery,

  useCreateBusinessMutation,

  useActivateBusinessMutation,
  useSuspendBusinessMutation,
  useCancelBusinessMutation,
} = businessesApi;
