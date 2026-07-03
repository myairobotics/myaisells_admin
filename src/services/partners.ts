import type {
  AssignPartnerLocationRequest,
  CreatePartnerRequest,
  CreatePartnerResponse,
  DeletePartnerResponse,
  EditPartnerRequest,
  GetAllPartnersResponse,
  GetOnePartnerResponse,
  GetPartnerAppointmentPerformanceResponse,
  GetPartnerAuditLogsResponse,
  GetPartnerCampaignPerformanceResponse,
  GetPartnerClientsResponse,
  GetPartnerReferralCodeResponse,
  GetPartnerRevenueResponse,
  PartnerActionResponse,
  TransferPartnerOwnershipRequest,
  UpdatePartnerStatusRequest,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const partnersApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getAllPartners: builder.query<GetAllPartnersResponse, { page?: number; limit?: number; search?: string }>({
      query: ({ page = 1, limit = 10, search }) => ({
        url: `${baseUrl}/partners`,
        params: { page, limit, ...(search && { search }) },
      }),
      providesTags: ['Partner'],
    }),

    getOnePartner: builder.query<GetOnePartnerResponse, string>({
      query: id => ({
        url: `${baseUrl}/partners/${id}`,
      }),
      providesTags: ['Partner'],
    }),

    createPartner: builder.mutation<CreatePartnerResponse, CreatePartnerRequest>({
      query: body => ({
        url: `${baseUrl}/partners`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),

    updatePartner: builder.mutation<PartnerActionResponse, { id: string; body: EditPartnerRequest }>({
      query: ({ id, body }) => ({
        url: `${baseUrl}/partners/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),

    updatePartnerStatus: builder.mutation<PartnerActionResponse, { id: string; body: UpdatePartnerStatusRequest }>({
      query: ({ id, body }) => ({
        url: `${baseUrl}/partners/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),

    deletePartner: builder.mutation<DeletePartnerResponse, string>({
      query: id => ({
        url: `${baseUrl}/partners/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Partner'],
    }),

    assignPartnerLocation: builder.mutation<PartnerActionResponse, { id: string; body: AssignPartnerLocationRequest }>({
      query: ({ id, body }) => ({
        url: `${baseUrl}/partners/${id}/location`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),

    transferPartnerOwnership: builder.mutation<PartnerActionResponse, { id: string; body: TransferPartnerOwnershipRequest }>({
      query: ({ id, body }) => ({
        url: `${baseUrl}/partners/${id}/transfer-ownership`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Partner'],
    }),

    getPartnerClients: builder.query<GetPartnerClientsResponse, { partnerId: string; page?: number; limit?: number }>({
      query: ({ partnerId, page, limit }) => ({
        url: `${baseUrl}/partners/${partnerId}/clients`,
        params: { ...(page && { page }), ...(limit && { limit }) },
      }),
      providesTags: ['Partner'],
    }),

    getPartnerReferralCode: builder.query<GetPartnerReferralCodeResponse, string>({
      query: id => ({ url: `${baseUrl}/partners/${id}/referral-code` }),
      providesTags: ['Partner'],
    }),

    getPartnerRevenue: builder.query<GetPartnerRevenueResponse, string>({
      query: id => ({ url: `${baseUrl}/partners/${id}/revenue` }),
      providesTags: ['Partner'],
    }),

    getPartnerCampaignPerformance: builder.query<GetPartnerCampaignPerformanceResponse, string>({
      query: id => ({ url: `${baseUrl}/partners/${id}/campaign-performance` }),
      providesTags: ['Partner'],
    }),

    getPartnerAppointmentPerformance: builder.query<GetPartnerAppointmentPerformanceResponse, string>({
      query: id => ({ url: `${baseUrl}/partners/${id}/appointment-performance` }),
      providesTags: ['Partner'],
    }),

    getPartnerAuditLogs: builder.query<GetPartnerAuditLogsResponse, { partnerId: string; page?: number; limit?: number }>({
      query: ({ partnerId, page, limit }) => ({
        url: `${baseUrl}/partners/${partnerId}/audit-logs`,
        params: { ...(page && { page }), ...(limit && { limit }) },
      }),
      providesTags: ['Partner'],
    }),
  }),
});

export const {
  useGetAllPartnersQuery,
  useGetOnePartnerQuery,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useUpdatePartnerStatusMutation,
  useDeletePartnerMutation,
  useAssignPartnerLocationMutation,
  useTransferPartnerOwnershipMutation,
  useGetPartnerClientsQuery,
  useGetPartnerReferralCodeQuery,
  useGetPartnerRevenueQuery,
  useGetPartnerCampaignPerformanceQuery,
  useGetPartnerAppointmentPerformanceQuery,
  useGetPartnerAuditLogsQuery,
} = partnersApi;
