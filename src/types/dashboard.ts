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
