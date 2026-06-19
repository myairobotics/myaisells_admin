import type { GetPlatformConfigResponse, GetSubscriptionPlansResponse } from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const platformSettingsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getSubscriptionPlans: builder.query<GetSubscriptionPlansResponse, void>({
      query: () => ({ url: `${baseUrl}/settings/plans` }),
      providesTags: ['Setting'],
    }),
    getPlatformConfig: builder.query<GetPlatformConfigResponse, void>({
      query: () => ({ url: `${baseUrl}/settings/platform` }),
      providesTags: ['Setting'],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useGetPlatformConfigQuery,
} = platformSettingsApi;
