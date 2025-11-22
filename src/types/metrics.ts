import type { ApiAdminResponse } from './api';

export interface DailyUserCountMetrics {
  date: string;
  unverified: number;
  verified: number;
}

export interface UsersByCountryMetrics {
  country: string;
  count: number;
}

export interface UserItem {
  id: string;
  email: string;
  is_active: boolean;
  created_at: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  sortBy: string;
  sortDir: string;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export type UpdateUserStatusRequest = {
  userId: number;
  status: boolean;
};

export interface UpdateUserStatus {
  message: string;
}

export interface PaymentCustomer {
  id: string;
  object: string;
  address: unknown;
  balance: number;
  created: number;
  currency: string;
  default_source: string | null;
  delinquent: boolean;
  description: string | null;
  discount: unknown;
  email: string;
  invoice_prefix: string;
  invoice_settings: {
    custom_fields: unknown;
    default_payment_method: unknown;
    footer: unknown;
    rendering_options: unknown;
  };
  livemode: boolean;
  metadata: Record<string, unknown>;
  name: string;
  next_invoice_sequence: number;
  phone: string | null;
  preferred_locales: string[];
  shipping: unknown;
  tax_exempt: string;
  test_clock: unknown;
}

export interface GetPaymentsHistory {
  id: string;
  amount: number;
  currency: string;
  customer: PaymentCustomer;
  status: string;
  paid: boolean;
  created: string;
  description: string;
}

export interface DailyCampaignCountMetrics {
  date: string;
  outreach: number;
  sales: number;
}

export interface DailyCampaignConversationCountMetrics {
  date: string;
  outreach: number;
  sales: number;
  web_agents: number;
  web_agent_chat: number;
}

export interface SubscriptionMetrics {
  plan: string;
  count: number;
}

export interface DailyAppointmentCount {
  date: string;
  count: number;
}

export interface AppointmentMetrics {
  dailyAppointments: DailyAppointmentCount[];
  totalAppointments: number;
}

export interface ViewUsersMetrics {
  data: UserItem[];
  meta: PaginationMeta;
}

export interface GetUserCountMetrics {
  dailyCounts: DailyUserCountMetrics[];
  totalUsers: number;
}

export interface GetCampaignsMetrics {
  dailyCounts: DailyCampaignCountMetrics[];
  totalOutreach: number;
  totalSales: number;
}

export interface GetCampaignConversationMetrics {
  dailyCounts: DailyCampaignConversationCountMetrics[];
  totalOutreach: number;
  totalSales: number;
  totalWebAgents: number;
  totalWebAgentChat: number;
}

export interface UpgradeOrDowngradeMetrics {
  month: number;
  year: number;
  upgraded: number;
  downgraded: number;
}

export type GetUserCountMetricsResponse
  = ApiAdminResponse<GetUserCountMetrics>;

export type GetSubscriptionMetricResponse
  = ApiAdminResponse<SubscriptionMetrics>;

export type GetViewUsersResponse
  = ApiAdminResponse<ViewUsersMetrics>;

export type GetUsersByCountryResponse
  = ApiAdminResponse<UsersByCountryMetrics[]>;

export type UpdateUserStatusResponse
  = ApiAdminResponse<UpdateUserStatus>;

export type GetPaymentsHistoryResponse
  = ApiAdminResponse<GetPaymentsHistory[]>;

export type GetCampaignsMetricsResponse
  = ApiAdminResponse<GetCampaignsMetrics>;

export type GetCampaignConversationMetricsResponse
  = ApiAdminResponse<GetCampaignConversationMetrics>;

export type GetAppointmentMetricsResponse
  = ApiAdminResponse<AppointmentMetrics>;

export type GetUpgradeOrDowngradeMetricsResponse
  = ApiAdminResponse<UpgradeOrDowngradeMetrics>;
