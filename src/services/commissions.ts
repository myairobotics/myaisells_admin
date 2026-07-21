import type {
  AdjustCommissionEarningRequest,
  AssignCommissionStructureRequest,
  AssignCommissionStructureResponse,
  CommissionEarningActionResponse,
  CommissionEarningsFilters,
  CommissionPayoutActionResponse,
  CreateCommissionPayoutRequest,
  CreateCommissionPayoutResponse,
  CreateCommissionPhaseRequest,
  CreateCommissionPhaseResponse,
  CreateCommissionStructureRequest,
  CreateCommissionStructureResponse,
  DeleteCommissionPhaseResponse,
  GetCommissionBeneficiaryAssignmentsResponse,
  GetCommissionDashboardResponse,
  GetCommissionEarningsResponse,
  GetCommissionPayoutsResponse,
  GetCommissionStructuresResponse,
  GetOneCommissionPayoutResponse,
  GetOneCommissionStructureResponse,
  MarkPayoutPaidRequest,
  ReasonRequest,
  UnassignCommissionStructureResponse,
  UpdateCommissionPhaseRequest,
  UpdateCommissionPhaseResponse,
  UpdateCommissionStructureRequest,
  UpdateCommissionStructureResponse,
  UpdateCommissionStructureStatusResponse,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const commissionsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    // Structures
    getCommissionStructures: builder.query<GetCommissionStructuresResponse, { appliesTo?: string; ownerAccountId?: string; status?: string }>({
      query: ({ appliesTo, ownerAccountId, status } = {}) => ({
        url: `${baseUrl}/commissions/structures`,
        params: { ...(appliesTo && { appliesTo }), ...(ownerAccountId && { ownerAccountId }), ...(status && { status }) },
      }),
      providesTags: ['Commission'],
    }),

    createCommissionStructure: builder.mutation<CreateCommissionStructureResponse, CreateCommissionStructureRequest>({
      query: body => ({
        url: `${baseUrl}/commissions/structures`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    getOneCommissionStructure: builder.query<GetOneCommissionStructureResponse, string>({
      query: structureId => ({ url: `${baseUrl}/commissions/structures/${structureId}` }),
      providesTags: ['Commission'],
    }),

    updateCommissionStructure: builder.mutation<UpdateCommissionStructureResponse, { structureId: string; body: UpdateCommissionStructureRequest }>({
      query: ({ structureId, body }) => ({
        url: `${baseUrl}/commissions/structures/${structureId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    updateCommissionStructureStatus: builder.mutation<UpdateCommissionStructureStatusResponse, { structureId: string; status: string }>({
      query: ({ structureId, status }) => ({
        url: `${baseUrl}/commissions/structures/${structureId}/status`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Commission'],
    }),

    // Phases
    createCommissionPhase: builder.mutation<CreateCommissionPhaseResponse, { structureId: string; body: CreateCommissionPhaseRequest }>({
      query: ({ structureId, body }) => ({
        url: `${baseUrl}/commissions/structures/${structureId}/phases`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    updateCommissionPhase: builder.mutation<UpdateCommissionPhaseResponse, { phaseId: string; body: UpdateCommissionPhaseRequest }>({
      query: ({ phaseId, body }) => ({
        url: `${baseUrl}/commissions/phases/${phaseId}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    deleteCommissionPhase: builder.mutation<DeleteCommissionPhaseResponse, string>({
      query: phaseId => ({
        url: `${baseUrl}/commissions/phases/${phaseId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Commission'],
    }),

    // Assignments
    assignCommissionStructure: builder.mutation<AssignCommissionStructureResponse, { structureId: string; body: AssignCommissionStructureRequest }>({
      query: ({ structureId, body }) => ({
        url: `${baseUrl}/commissions/structures/${structureId}/assign`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    unassignCommissionStructure: builder.mutation<UnassignCommissionStructureResponse, string>({
      query: assignmentId => ({
        url: `${baseUrl}/commissions/assignments/${assignmentId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Commission'],
    }),

    getCommissionBeneficiaryAssignments: builder.query<GetCommissionBeneficiaryAssignmentsResponse, { beneficiaryType: string; beneficiaryId: string }>({
      query: ({ beneficiaryType, beneficiaryId }) => ({
        url: `${baseUrl}/commissions/beneficiaries/${beneficiaryType}/${beneficiaryId}/assignments`,
      }),
      providesTags: ['Commission'],
    }),

    // Earnings
    getCommissionEarnings: builder.query<GetCommissionEarningsResponse, CommissionEarningsFilters>({
      query: ({ page = 1, limit = 15, ...filters } = {}) => ({
        url: `${baseUrl}/commissions/earnings`,
        params: { page, limit, ...filters },
      }),
      providesTags: ['Commission'],
    }),

    exportCommissionEarnings: builder.mutation<Blob, CommissionEarningsFilters | void>({
      query: (filters = {}) => ({
        url: `${baseUrl}/commissions/earnings/export`,
        params: filters as Record<string, unknown>,
        responseHandler: response => response.blob(),
      }),
    }),

    approveCommissionEarning: builder.mutation<CommissionEarningActionResponse, string>({
      query: earningId => ({
        url: `${baseUrl}/commissions/earnings/${earningId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Commission'],
    }),

    holdCommissionEarning: builder.mutation<CommissionEarningActionResponse, { earningId: string; body: ReasonRequest }>({
      query: ({ earningId, body }) => ({
        url: `${baseUrl}/commissions/earnings/${earningId}/hold`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    releaseCommissionEarning: builder.mutation<CommissionEarningActionResponse, string>({
      query: earningId => ({
        url: `${baseUrl}/commissions/earnings/${earningId}/release`,
        method: 'POST',
      }),
      invalidatesTags: ['Commission'],
    }),

    reverseCommissionEarning: builder.mutation<CommissionEarningActionResponse, { earningId: string; body: ReasonRequest }>({
      query: ({ earningId, body }) => ({
        url: `${baseUrl}/commissions/earnings/${earningId}/reverse`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    cancelCommissionEarning: builder.mutation<CommissionEarningActionResponse, { earningId: string; body: ReasonRequest }>({
      query: ({ earningId, body }) => ({
        url: `${baseUrl}/commissions/earnings/${earningId}/cancel`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    adjustCommissionEarning: builder.mutation<CommissionEarningActionResponse, { earningId: string; body: AdjustCommissionEarningRequest }>({
      query: ({ earningId, body }) => ({
        url: `${baseUrl}/commissions/earnings/${earningId}/adjust`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    // Payouts
    getCommissionPayouts: builder.query<GetCommissionPayoutsResponse, { beneficiaryId?: string; status?: string }>({
      query: ({ beneficiaryId, status } = {}) => ({
        url: `${baseUrl}/commissions/payouts`,
        params: { ...(beneficiaryId && { beneficiaryId }), ...(status && { status }) },
      }),
      providesTags: ['Commission'],
    }),

    getOneCommissionPayout: builder.query<GetOneCommissionPayoutResponse, string>({
      query: payoutId => ({ url: `${baseUrl}/commissions/payouts/${payoutId}` }),
      providesTags: ['Commission'],
    }),

    createCommissionPayout: builder.mutation<CreateCommissionPayoutResponse, CreateCommissionPayoutRequest>({
      query: body => ({
        url: `${baseUrl}/commissions/payouts`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    approveCommissionPayout: builder.mutation<CommissionPayoutActionResponse, string>({
      query: payoutId => ({
        url: `${baseUrl}/commissions/payouts/${payoutId}/approve`,
        method: 'POST',
      }),
      invalidatesTags: ['Commission'],
    }),

    markCommissionPayoutPaid: builder.mutation<CommissionPayoutActionResponse, { payoutId: string; body: MarkPayoutPaidRequest }>({
      query: ({ payoutId, body }) => ({
        url: `${baseUrl}/commissions/payouts/${payoutId}/mark-paid`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Commission'],
    }),

    cancelCommissionPayout: builder.mutation<CommissionPayoutActionResponse, string>({
      query: payoutId => ({
        url: `${baseUrl}/commissions/payouts/${payoutId}/cancel`,
        method: 'POST',
      }),
      invalidatesTags: ['Commission'],
    }),

    // Dashboards
    getCommissionDashboard: builder.query<GetCommissionDashboardResponse, void>({
      query: () => ({ url: `${baseUrl}/commissions/dashboard` }),
      providesTags: ['Commission'],
    }),

    getMyCommissionDashboard: builder.query<GetCommissionDashboardResponse, void>({
      query: () => ({ url: `${baseUrl}/commissions/my/dashboard` }),
      providesTags: ['Commission'],
    }),

    getMyCommissionEarnings: builder.query<GetCommissionEarningsResponse, CommissionEarningsFilters>({
      query: ({ page = 1, limit = 15, ...filters } = {}) => ({
        url: `${baseUrl}/commissions/my/earnings`,
        params: { page, limit, ...filters },
      }),
      providesTags: ['Commission'],
    }),

    exportMyCommissionEarnings: builder.mutation<Blob, CommissionEarningsFilters | void>({
      query: (filters = {}) => ({
        url: `${baseUrl}/commissions/my/earnings/export`,
        params: filters as Record<string, unknown>,
        responseHandler: response => response.blob(),
      }),
    }),

    getMyCommissionPayouts: builder.query<GetCommissionPayoutsResponse, void>({
      query: () => ({ url: `${baseUrl}/commissions/my/payouts` }),
      providesTags: ['Commission'],
    }),
  }),
});

export const {
  useGetCommissionStructuresQuery,
  useLazyGetCommissionStructuresQuery,
  useCreateCommissionStructureMutation,
  useGetOneCommissionStructureQuery,
  useLazyGetOneCommissionStructureQuery,
  useUpdateCommissionStructureMutation,
  useUpdateCommissionStructureStatusMutation,

  useCreateCommissionPhaseMutation,
  useUpdateCommissionPhaseMutation,
  useDeleteCommissionPhaseMutation,

  useAssignCommissionStructureMutation,
  useUnassignCommissionStructureMutation,
  useGetCommissionBeneficiaryAssignmentsQuery,
  useLazyGetCommissionBeneficiaryAssignmentsQuery,

  useGetCommissionEarningsQuery,
  useLazyGetCommissionEarningsQuery,
  useExportCommissionEarningsMutation,
  useApproveCommissionEarningMutation,
  useHoldCommissionEarningMutation,
  useReleaseCommissionEarningMutation,
  useReverseCommissionEarningMutation,
  useCancelCommissionEarningMutation,
  useAdjustCommissionEarningMutation,

  useGetCommissionPayoutsQuery,
  useLazyGetCommissionPayoutsQuery,
  useGetOneCommissionPayoutQuery,
  useLazyGetOneCommissionPayoutQuery,
  useCreateCommissionPayoutMutation,
  useApproveCommissionPayoutMutation,
  useMarkCommissionPayoutPaidMutation,
  useCancelCommissionPayoutMutation,

  useGetCommissionDashboardQuery,
  useLazyGetCommissionDashboardQuery,
  useGetMyCommissionDashboardQuery,
  useLazyGetMyCommissionDashboardQuery,
  useGetMyCommissionEarningsQuery,
  useLazyGetMyCommissionEarningsQuery,
  useExportMyCommissionEarningsMutation,
  useGetMyCommissionPayoutsQuery,
  useLazyGetMyCommissionPayoutsQuery,
} = commissionsApi;
