import type {
  BusinessSupportAccessResponse,
  CreateBusinessOnboardingResponse,
  CreateBusinessRequest,
  GetAdminBusinessesResponse,
  GetAdminBusinessResponse,
  UpdateBusinessStatusRequest,
  UpdateBusinessStatusResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const businessesApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAdminBusinesses: builder.query<GetAdminBusinessesResponse, {
      page?: number;
      limit?: number;
      status?: string;
      search?: string;
      partner?: string;
      attributionSource?: string;
      setupStatus?: string;
      country?: string;
      dateFrom?: string;
      dateTo?: string;
    }>({
      query: ({ page = 1, limit = 15, status, search, partner, attributionSource, setupStatus, country, dateFrom, dateTo } = {}) => ({
        url: `${baseUrl}/businesses`,
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(search && { search }),
          ...(partner && { partner }),
          ...(attributionSource && { attributionSource }),
          ...(setupStatus && { setupStatus }),
          ...(country && { country }),
          ...(dateFrom && { dateFrom }),
          ...(dateTo && { dateTo }),
        },
      }),
      providesTags: ['Business'],
    }),

    getAdminBusiness: builder.query<GetAdminBusinessResponse, string>({
      query: id => ({ url: `${baseUrl}/businesses/${id}` }),
      providesTags: ['Business'],
    }),

    createBusinessOnboarding: builder.mutation<CreateBusinessOnboardingResponse, CreateBusinessRequest>({
      query: body => ({
        url: `${baseUrl}/business-onboarding`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Business'],
    }),

    updateBusinessStatus: builder.mutation<UpdateBusinessStatusResponse, { id: string; body: UpdateBusinessStatusRequest }>({
      query: ({ id, body }) => ({
        url: `${baseUrl}/businesses/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Business'],
    }),

    businessSupportAccess: builder.mutation<BusinessSupportAccessResponse, string>({
      query: id => ({
        url: `${baseUrl}/businesses/${id}/support-access`,
        method: 'POST',
      }),
      invalidatesTags: ['Business'],
    }),
  }),
});

export const {
  useGetAdminBusinessesQuery,
  useLazyGetAdminBusinessesQuery,

  useGetAdminBusinessQuery,
  useLazyGetAdminBusinessQuery,

  useCreateBusinessOnboardingMutation,

  useUpdateBusinessStatusMutation,

  useBusinessSupportAccessMutation,
} = businessesApi;
