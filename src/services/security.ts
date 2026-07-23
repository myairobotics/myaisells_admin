import type {
  ConfirmTwoFactorRequest,
  ConfirmTwoFactorResponse,
  DisableTwoFactorRequest,
  DisableTwoFactorResponse,
  GetSecuritySessionsResponse,
  GetTwoFactorStatusResponse,
  RevokeAllOtherSessionsResponse,
  RevokeSecuritySessionResponse,
  SetupTwoFactorResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const securityApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getTwoFactorStatus: builder.query<GetTwoFactorStatusResponse, void>({
      query: () => ({ url: `${baseUrl}/security/2fa` }),
      providesTags: ['Security'],
    }),

    setupTwoFactor: builder.mutation<SetupTwoFactorResponse, void>({
      query: () => ({
        url: `${baseUrl}/security/2fa/setup`,
        method: 'POST',
      }),
      invalidatesTags: ['Security'],
    }),

    confirmTwoFactor: builder.mutation<ConfirmTwoFactorResponse, ConfirmTwoFactorRequest>({
      query: body => ({
        url: `${baseUrl}/security/2fa/confirm`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Security'],
    }),

    disableTwoFactor: builder.mutation<DisableTwoFactorResponse, DisableTwoFactorRequest>({
      query: body => ({
        url: `${baseUrl}/security/2fa/disable`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Security'],
    }),

    getSecuritySessions: builder.query<GetSecuritySessionsResponse, void>({
      query: () => ({ url: `${baseUrl}/security/sessions` }),
      providesTags: ['Security'],
    }),

    revokeSecuritySession: builder.mutation<RevokeSecuritySessionResponse, string>({
      query: sessionId => ({
        url: `${baseUrl}/security/sessions/${sessionId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Security'],
    }),

    revokeAllOtherSessions: builder.mutation<RevokeAllOtherSessionsResponse, void>({
      query: () => ({
        url: `${baseUrl}/security/sessions/revoke-all-others`,
        method: 'POST',
      }),
      invalidatesTags: ['Security'],
    }),
  }),
});

export const {
  useGetTwoFactorStatusQuery,
  useLazyGetTwoFactorStatusQuery,
  useSetupTwoFactorMutation,
  useConfirmTwoFactorMutation,
  useDisableTwoFactorMutation,
  useGetSecuritySessionsQuery,
  useLazyGetSecuritySessionsQuery,
  useRevokeSecuritySessionMutation,
  useRevokeAllOtherSessionsMutation,
} = securityApi;
