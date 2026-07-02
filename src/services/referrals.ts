import type {
  GetReferralMetricsResponse,
  GetReferredUsersResponse,
  ReassignReferralCodeRequest,
  ReassignReferralCodeResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const referralsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getReferralMetrics: builder.query<GetReferralMetricsResponse, void>({
      query: () => ({ url: `${baseUrl}/referral/metrics` }),
      providesTags: ['Referral'],
    }),

    getReferredUsers: builder.query<GetReferredUsersResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 15 } = {}) => ({
        url: `${baseUrl}/referral/users`,
        params: { page, limit },
      }),
      providesTags: ['Referral'],
    }),

    reassignReferralCode: builder.mutation<ReassignReferralCodeResponse, { userId: string } & ReassignReferralCodeRequest>({
      query: ({ userId, ...body }) => ({
        url: `${baseUrl}/referral/app-users/${userId}/reassign`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Referral'],
    }),
  }),
});

export const {
  useGetReferralMetricsQuery,
  useLazyGetReferralMetricsQuery,
  useGetReferredUsersQuery,
  useLazyGetReferredUsersQuery,
  useReassignReferralCodeMutation,
} = referralsApi;
