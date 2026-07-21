import type {
  BillingPaymentsFilters,
  CancelBillingSubscriptionRequest,
  CancelBillingSubscriptionResponse,
  ChangePlanRequest,
  ChangePlanResponse,
  CreditBusinessRequest,
  CreditBusinessResponse,
  GetBillingCreditsResponse,
  GetBillingPaymentsResponse,
  GetBillingRefundsResponse,
  GetOneBillingPaymentResponse,
  RefundPaymentRequest,
  RefundPaymentResponse,
  UpdateBillingPlanResponse,
  UpdatePlanRequest,
} from '@/types';
import { baseApi } from '@/store/api/baseApi';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl('/api/admin');

export const billingApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getBillingPayments: builder.query<GetBillingPaymentsResponse, BillingPaymentsFilters>({
      query: ({ page = 1, limit = 15, ...filters } = {}) => ({
        url: `${baseUrl}/billing/payments`,
        params: { page, limit, ...filters },
      }),
      providesTags: ['Billing'],
    }),

    getOneBillingPayment: builder.query<GetOneBillingPaymentResponse, string>({
      query: subId => ({ url: `${baseUrl}/billing/payments/${subId}` }),
      providesTags: ['Billing'],
    }),

    refundPayment: builder.mutation<RefundPaymentResponse, { subId: string; body: RefundPaymentRequest }>({
      query: ({ subId, body }) => ({
        url: `${baseUrl}/billing/payments/${subId}/refund`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing'],
    }),

    getBillingRefunds: builder.query<GetBillingRefundsResponse, void>({
      query: () => ({ url: `${baseUrl}/billing/refunds` }),
      providesTags: ['Billing'],
    }),

    creditBusiness: builder.mutation<CreditBusinessResponse, { businessAppUserId: string; body: CreditBusinessRequest }>({
      query: ({ businessAppUserId, body }) => ({
        url: `${baseUrl}/billing/businesses/${businessAppUserId}/credit`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing'],
    }),

    getBillingCredits: builder.query<GetBillingCreditsResponse, void>({
      query: () => ({ url: `${baseUrl}/billing/credits` }),
      providesTags: ['Billing'],
    }),

    cancelBillingSubscription: builder.mutation<CancelBillingSubscriptionResponse, { subId: string; body?: CancelBillingSubscriptionRequest }>({
      query: ({ subId, body }) => ({
        url: `${baseUrl}/billing/payments/${subId}/cancel-subscription`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing'],
    }),

    changePlan: builder.mutation<ChangePlanResponse, ChangePlanRequest>({
      query: body => ({
        url: `${baseUrl}/billing/change-plan`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Billing'],
    }),

    updateBillingPlan: builder.mutation<UpdateBillingPlanResponse, { planId: string; body: UpdatePlanRequest }>({
      query: ({ planId, body }) => ({
        url: `${baseUrl}/billing/plans/${planId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Billing', 'Setting'],
    }),
  }),
});

export const {
  useGetBillingPaymentsQuery,
  useLazyGetBillingPaymentsQuery,
  useGetOneBillingPaymentQuery,
  useLazyGetOneBillingPaymentQuery,
  useRefundPaymentMutation,
  useGetBillingRefundsQuery,
  useLazyGetBillingRefundsQuery,
  useCreditBusinessMutation,
  useGetBillingCreditsQuery,
  useLazyGetBillingCreditsQuery,
  useCancelBillingSubscriptionMutation,
  useChangePlanMutation,
  useUpdateBillingPlanMutation,
} = billingApi;
