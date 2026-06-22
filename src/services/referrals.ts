import type { GetReferralCodesResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const referralsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getReferralCodes: builder.query<GetReferralCodesResponse, { page?: number; limit?: number; status?: string; owner_type?: string; search?: string }>({
      query: ({ page = 1, limit = 15, status, owner_type, search } = {}) => ({
        url: `${baseUrl}/referrals`,
        params: {
          page,
          limit,
          ...(status && { status }),
          ...(owner_type && { owner_type }),
          ...(search && { search }),
        },
      }),
      providesTags: ['Referral'],
    }),
  }),
});

export const {
  useGetReferralCodesQuery,
} = referralsApi;
