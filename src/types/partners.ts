import type { ApiAdminResponse } from './api';

export type PartnerStatus = 'active' | 'suspended' | 'pending' | 'cancelled';

export interface PartnerStaffPosition {
  label: string;
}

export interface PartnerStaffMember {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
  position: PartnerStaffPosition | null;
}

export interface Partner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: PartnerStatus;
  region: string | null;
  tag: string | null;
  last_login_at: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  email_verified_at?: string | null;
  staff?: PartnerStaffMember[];
}

export interface PartnerListItem {
  id: string;
  first_name: string;
  last_name: string;
  status: PartnerStatus;
}

export interface CreatePartnerRequest {
  first_name: string;
  last_name: string;
  email: string;
  region: string;
  tag: string;
  password: string;
}

export interface CreatePartnerResponse {
  success: boolean;
  message: string;
}

export interface PartnerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PartnerListData {
  data: PartnerListItem[];
  meta: PartnerPaginationMeta;
}

export interface PartnerActionResponse {
  success: boolean;
  message: string;
}

export interface EditPartnerRequest {
  first_name?: string;
  last_name?: string;
  region?: string;
  tag?: string;
}

export interface UpdatePartnerStatusRequest {
  status: PartnerStatus;
  reason?: string;
}

export interface AssignPartnerLocationRequest {
  location: {
    region: string;
  };
}

export interface TransferPartnerOwnershipRequest {
  targetPartnerId: string;
  reason: string;
}

export interface DeletePartnerData {
  success: boolean;
  message: string;
}

export interface PartnerClient {
  appUserId: string;
  firstName: string;
  lastName: string;
  email: string;
  dateJoined: string;
  referralCode: string | null;
  referredByTeamMemberId: string | null;
  referredByTeamMember: string | null;
}

export interface PartnerClientsMeta {
  total: number;
  page: number;
  pageSize: number;
  pages: number;
}

export interface PartnerClientsData {
  data: PartnerClient[];
  meta: PartnerClientsMeta;
}

export interface PartnerRevenue {
  totalRevenue: number;
  totalSubscriptions: number;
  activeSubscriptions: number;
}

export interface PartnerCampaignPerformanceSummary {
  totalCampaigns: number;
  activeCampaigns: number;
  inactiveCampaigns: number;
  averageOpenRate: number;
  statusBreakdown: unknown[];
  totalRecipients: number;
  totalOpened: number;
  openRatePercentage: number;
}

export interface PartnerCampaignPerformance {
  performanceSummary: PartnerCampaignPerformanceSummary;
  generatedAt: string;
}

export interface PartnerAppointmentSummary {
  completed: number;
  pending: number;
  cancelled: number;
}

export interface PartnerAppointmentPerformanceData {
  data: unknown[];
  summary: PartnerAppointmentSummary;
  meta: PartnerClientsMeta;
}

export interface PartnerAuditLog {
  id: string;
  actorPool: string;
  actorRole: string | null;
  adminId: string | null;
  partnerId: string | null;
  teamMemberId: string | null;
  userId: string | null;
  action: string;
  module: string;
  targetType: string | null;
  targetId: string | null;
  oldValue: unknown;
  newValue: unknown;
  ipAddress: string | null;
  deviceInfo: unknown;
  supportSessionId: string | null;
  reason: string | null;
  status: string;
  created_at: string;
}

export interface PartnerAuditLogsMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PartnerAuditLogsData {
  data: PartnerAuditLog[];
  meta: PartnerAuditLogsMeta;
}

export type GetAllPartnersResponse = ApiAdminResponse<PartnerListData>;
export type GetOnePartnerResponse = ApiAdminResponse<Partner>;
export type GetPartnerClientsResponse = ApiAdminResponse<PartnerClientsData>;
export type GetPartnerReferralCodeResponse = ApiAdminResponse<string>;
export type GetPartnerRevenueResponse = ApiAdminResponse<PartnerRevenue>;
export type GetPartnerCampaignPerformanceResponse = ApiAdminResponse<PartnerCampaignPerformance>;
export type GetPartnerAppointmentPerformanceResponse = ApiAdminResponse<PartnerAppointmentPerformanceData>;
export type GetPartnerAuditLogsResponse = ApiAdminResponse<PartnerAuditLogsData>;
export type DeletePartnerResponse = ApiAdminResponse<DeletePartnerData>;
