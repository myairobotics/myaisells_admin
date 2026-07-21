import type { ApiAdminResponse } from './api';

export interface DashboardOverview {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  partnerUsers: number;
  totalPartners: number;
  totalCampaigns: number;
  totalAppointments: number;
  totalSubscriptions: number;
  totalSalesAgents: number;
}

export type GetDashboardOverviewResponse = ApiAdminResponse<DashboardOverview> & {
  message: string;
};

export interface DashboardSummaryBusinesses {
  total: number;
  active: number;
  suspended: number;
}

export interface DashboardSummaryPartners {
  total: number;
  active: number;
  suspended: number;
  pending: number;
  cancelled: number;
}

export interface DashboardSummaryPartnerAdminUsers {
  total: number;
  active: number;
  suspended: number;
}

export interface DashboardSummarySalesAgents {
  global: number;
  partner: number;
  total: number;
}

export interface DashboardSummaryCampaigns {
  totalCampaigns: number;
  activeCampaigns: number;
}

export interface DashboardSummaryAppointments {
  total: number;
  completed: number;
  pending: number;
  cancelled: number;
}

export interface DashboardSummarySubscriptions {
  totalRevenue: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
  cancelledSubscriptions: number;
}

export interface DashboardSummaryTokenUsage {
  totalTokensUsed: number;
  totalTokensCredited: number;
  currentWalletBalance: number;
}

export interface DashboardSummary {
  businesses: DashboardSummaryBusinesses;
  partners: DashboardSummaryPartners;
  partnerAdminUsers: DashboardSummaryPartnerAdminUsers;
  salesAgents: DashboardSummarySalesAgents;
  campaigns: DashboardSummaryCampaigns;
  appointments: DashboardSummaryAppointments;
  subscriptions: DashboardSummarySubscriptions;
  tokenUsage: DashboardSummaryTokenUsage;
  generatedAt: string;
}

export type GetDashboardSummaryResponse = ApiAdminResponse<DashboardSummary> & {
  message: string;
};

export interface DashboardTopCountry {
  country: string;
  businessCount: number;
  revenue: number;
}

export interface DashboardTopPartner {
  id: string;
  name: string;
  email: string;
  status: string;
  businessesReferred: number;
  revenueGenerated: number;
}

export interface DashboardTopSalesAgent {
  id: string;
  scope: string;
  name: string;
  email: string;
  businessesReferred: number;
  appointmentsBooked: number;
  revenueGenerated: number;
}

export interface DashboardLeaderboards {
  topCountries: DashboardTopCountry[];
  topPartners: DashboardTopPartner[];
  topSalesAgents: DashboardTopSalesAgent[];
  generatedAt: string;
}

export type GetDashboardLeaderboardsResponse = ApiAdminResponse<DashboardLeaderboards> & {
  message: string;
};

export interface DashboardSignupPeriod {
  period: string;
  count: number;
}

export interface DashboardChurn {
  cancelledSubscriptions: number;
  churnedBusinesses: number;
}

export interface DashboardFailedPayments {
  total: number;
  totalAmountAttempted: number;
  recent: unknown[];
}

export interface DashboardPendingBusiness {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
}

export interface DashboardPendingSetupGroup {
  count: number;
  businesses: DashboardPendingBusiness[];
}

export interface DashboardPendingSetup {
  awaitingSetup: DashboardPendingSetupGroup;
  incompleteProfile: DashboardPendingSetupGroup;
}

export interface DashboardGrowth {
  newSignupsByPeriod: DashboardSignupPeriod[];
  churn: DashboardChurn;
  failedPayments: DashboardFailedPayments;
  pendingSetup: DashboardPendingSetup;
  generatedAt: string;
}

export type GetDashboardGrowthResponse = ApiAdminResponse<DashboardGrowth> & {
  message: string;
};

export interface DashboardSupportActivityByPool {
  actor_pool: string | null;
  count: string;
}

export interface DashboardSupportActivity {
  total: number;
  byActorPool: DashboardSupportActivityByPool[];
  recent: unknown[];
  generatedAt: string;
}

export type GetDashboardSupportActivityResponse = ApiAdminResponse<DashboardSupportActivity> & {
  message: string;
};

export interface DashboardSectionResult<T> {
  data: T | null;
  error: string | null;
}

export interface DashboardFull {
  summary: DashboardSectionResult<DashboardSummary>;
  leaderboards: DashboardSectionResult<DashboardLeaderboards>;
  growth: DashboardSectionResult<DashboardGrowth>;
  supportActivity: DashboardSectionResult<DashboardSupportActivity>;
  generatedAt: string;
}

export type GetDashboardFullResponse = ApiAdminResponse<DashboardFull> & {
  message: string;
};

export interface DashboardMyBusinesses {
  total: number;
  active: number;
  pendingSetup: number;
}

export interface DashboardMyRecentlyOnboarded {
  id: string;
  name: string;
  email: string;
  dateJoined: string;
}

export interface DashboardMyConversion {
  totalBusinesses: number;
  convertedBusinesses: number;
  conversionRatePercentage: number;
}

export interface DashboardMyRevenue {
  totalRevenueAttributed: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
}

export interface DashboardMyCommission {
  byStatus: Record<string, number>;
  byBusiness: unknown[];
  trend: unknown[];
}

export interface DashboardMy {
  businesses: DashboardMyBusinesses;
  recentlyOnboarded: DashboardMyRecentlyOnboarded[];
  campaigns: DashboardSummaryCampaigns;
  appointments: DashboardSummaryAppointments;
  conversion: DashboardMyConversion;
  revenue: DashboardMyRevenue;
  tokenUsage: DashboardSummaryTokenUsage;
  commission: DashboardMyCommission;
  generatedAt: string;
}

export type GetDashboardMyResponse = ApiAdminResponse<DashboardMy> & {
  message: string;
};
