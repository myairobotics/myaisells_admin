import type { ApiAdminResponse } from './api';

export interface BillingPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

/** These list endpoints put `data` and `meta` as siblings on the response root, not nested under `data`. */
export interface PaginatedApiAdminResponse<T> {
  success: boolean;
  data: T[];
  meta: BillingPaginationMeta;
}

export interface BillingPayment {
  id: number;
  reference: string;
  status: string;
  amount_paid: string;
  is_topup: boolean;
  stripe_subscription_id: string | null;
  stripe_invoice_id: string | null;
  start_date: string;
  end_date: string | null;
  created_at: string;
  business_app_user_id: string;
  business_email: string;
  business_name: string;
  business_country: string;
  plan_id: number;
  plan_name: string;
  plan_price: string;
  partner_id: string | null;
  partner_first_name: string | null;
  partner_last_name: string | null;
}

export interface BillingPaymentsFilters {
  page?: number;
  limit?: number;
  status?: string;
  business?: string;
  partner?: string;
  isTopUp?: boolean;
  neverActivated?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

export interface RefundPaymentRequest {
  amount?: number;
  reason: string;
}

export interface BillingRefund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface CreditBusinessRequest {
  amount: number;
  reason: string;
}

export interface BillingCredit {
  id: string;
  businessAppUserId: string;
  amount: number;
  reason: string;
  created_at: string;
}

export interface CancelBillingSubscriptionRequest {
  reason?: string;
}

export interface ChangePlanRequest {
  businessAppUserId: string;
  planId: string;
}

export interface UpdatePlanRequest {
  name?: string;
  price?: number;
  description?: string;
}

export interface BillingPlan {
  id: string;
  name: string;
  price: number;
  description?: string | null;
}

export interface BillingActionResponse {
  success: boolean;
  message: string;
}

export type GetBillingPaymentsResponse = PaginatedApiAdminResponse<BillingPayment>;
export type GetOneBillingPaymentResponse = ApiAdminResponse<BillingPayment>;
export type RefundPaymentResponse = ApiAdminResponse<BillingRefund>;
export type GetBillingRefundsResponse = PaginatedApiAdminResponse<BillingRefund>;
export type CreditBusinessResponse = ApiAdminResponse<BillingCredit>;
export type GetBillingCreditsResponse = PaginatedApiAdminResponse<BillingCredit>;
export type CancelBillingSubscriptionResponse = ApiAdminResponse<BillingActionResponse>;
export type ChangePlanResponse = ApiAdminResponse<BillingActionResponse>;
export type UpdateBillingPlanResponse = ApiAdminResponse<BillingPlan>;
