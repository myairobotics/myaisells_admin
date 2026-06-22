import type { ApiAdminResponse } from './api';

export type AnalyticsPeriod = '7d' | '30d' | '90d' | '1y';

export interface AnalyticsSummary {
  total_revenue: number;
  mrr: number;
  arr: number;
  active_subscriptions: number;
  churned_subscriptions: number;
  new_businesses: number;
  new_users: number;
  total_tokens_consumed: number;
}

export interface AnalyticsDataPoint {
  date: string;
  value: number;
}

export interface AnalyticsTrends {
  revenue: AnalyticsDataPoint[];
  users: AnalyticsDataPoint[];
  businesses: AnalyticsDataPoint[];
  subscriptions: AnalyticsDataPoint[];
}

export interface AnalyticsOverview {
  summary: AnalyticsSummary;
  trends: AnalyticsTrends;
}

export type GetAnalyticsOverviewResponse = ApiAdminResponse<AnalyticsOverview>;
