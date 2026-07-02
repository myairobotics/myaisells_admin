import type { ApiAdminResponse } from './api';

export type AttributionSource = 'partner' | 'partner_team_member' | 'admin' | 'direct';

export interface ReferralBySource {
  source: AttributionSource;
  count: number;
  percentage: number;
}

export interface ReferralTopPartner {
  partnerId: string;
  partnerName: string;
  referredCount: number;
}

export interface ReferralTopSalesAgent {
  agentId: string;
  agentName: string;
  referredCount: number;
}

export interface ReferralMetrics {
  totalUsers: number;
  totalReferred: number;
  totalDirect: number;
  referredPercentage: number;
  bySource: ReferralBySource[];
  topPartners: ReferralTopPartner[];
  topPartnerSalesAgents: ReferralTopSalesAgent[];
  topGlobalSalesAgents: ReferralTopSalesAgent[];
}

export interface ReferredUser {
  appUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: string;
  referralCode: string;
  attributionSource: AttributionSource;
  partnerId: string | null;
  partnerName: string | null;
  partnerTeamMemberId: string | null;
  partnerTeamMemberName: string | null;
  adminId: string | null;
  adminName: string | null;
}

export interface ReferredUsersListData {
  rows: ReferredUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ReassignReferralCodeRequest {
  referralCode: string;
  reason: string;
}

export interface ReferralAttribution {
  appUserId: string;
  referralCodeId: string;
  referralCode: string;
  ownerType: string;
  partnerId: string | null;
  partnerTeamMemberId: string | null;
  adminId: string | null;
  attributionSource: AttributionSource;
}

export interface ReassignReferralCodeData {
  attribution: ReferralAttribution;
}

export type GetReferralMetricsResponse = ApiAdminResponse<ReferralMetrics>;
export type GetReferredUsersResponse = ApiAdminResponse<ReferredUsersListData>;
export type ReassignReferralCodeResponse = ApiAdminResponse<ReassignReferralCodeData>;
