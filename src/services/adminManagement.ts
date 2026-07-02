import type {
  AcceptAdminInviteRequest,
  AcceptAdminInviteResponse,
  AdminActionResponse,
  GetAdminInvitesResponse,
  GetAdminManagementStatsResponse,
  GetAdminResponse,
  GetAdminsResponse,
  InviteAdminRequest,
  InviteAdminResponse,
  ResendAdminInviteResponse,
  ValidateInviteTokenResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const adminManagementApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAdminManagementStats: builder.query<GetAdminManagementStatsResponse, void>({
      query: () => ({ url: `${baseUrl}/management/stats` }),
      providesTags: ['AdminManagement'],
    }),

    getAdmins: builder.query<GetAdminsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 15 } = {}) => ({
        url: `${baseUrl}/management/admins`,
        params: { page, limit },
      }),
      providesTags: ['AdminManagement'],
    }),

    getAdmin: builder.query<GetAdminResponse, string>({
      query: id => ({ url: `${baseUrl}/management/admins/${id}` }),
      providesTags: ['AdminManagement'],
    }),

    inviteAdmin: builder.mutation<InviteAdminResponse, InviteAdminRequest>({
      query: body => ({
        url: `${baseUrl}/management/admins/invite`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['AdminManagement'],
    }),

    getAdminInvites: builder.query<GetAdminInvitesResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 15 } = {}) => ({
        url: `${baseUrl}/management/admin-invites`,
        params: { page, limit },
      }),
      providesTags: ['AdminManagement'],
    }),

    resendAdminInvite: builder.mutation<ResendAdminInviteResponse, string>({
      query: inviteId => ({
        url: `${baseUrl}/management/admin-invites/${inviteId}/resend`,
        method: 'POST',
      }),
      invalidatesTags: ['AdminManagement'],
    }),

    cancelAdminInvite: builder.mutation<AdminActionResponse, string>({
      query: inviteId => ({
        url: `${baseUrl}/management/admin-invites/${inviteId}/cancel`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminManagement'],
    }),

    deactivateAdmin: builder.mutation<AdminActionResponse, string>({
      query: adminId => ({
        url: `${baseUrl}/management/admins/${adminId}/deactivate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminManagement'],
    }),

    activateAdmin: builder.mutation<AdminActionResponse, string>({
      query: adminId => ({
        url: `${baseUrl}/management/admins/${adminId}/activate`,
        method: 'PATCH',
      }),
      invalidatesTags: ['AdminManagement'],
    }),

    validateInviteToken: builder.query<ValidateInviteTokenResponse, string>({
      query: token => ({ url: `${baseUrl}/management/admins/invites/validate/${token}` }),
    }),

    acceptAdminInvite: builder.mutation<AcceptAdminInviteResponse, AcceptAdminInviteRequest>({
      query: body => ({
        url: `${baseUrl}/management/admins/invites/accept`,
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const {
  useGetAdminManagementStatsQuery,
  useLazyGetAdminManagementStatsQuery,
  useGetAdminsQuery,
  useLazyGetAdminsQuery,
  useGetAdminQuery,
  useLazyGetAdminQuery,
  useInviteAdminMutation,
  useGetAdminInvitesQuery,
  useLazyGetAdminInvitesQuery,
  useResendAdminInviteMutation,
  useCancelAdminInviteMutation,
  useDeactivateAdminMutation,
  useActivateAdminMutation,
  useValidateInviteTokenQuery,
  useLazyValidateInviteTokenQuery,
  useAcceptAdminInviteMutation,
} = adminManagementApi;
