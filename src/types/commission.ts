import type { ApiAdminResponse } from './api';

export type CommissionBeneficiaryType = 'partner' | 'global_sales_agent';
export type CommissionStructureStatus = 'active' | 'inactive';
export type CommissionEarningStatus = 'pending' | 'approved' | 'held' | 'released' | 'reversed' | 'cancelled';
export type CommissionPayoutStatus = 'pending' | 'approved' | 'paid' | 'cancelled';

export interface CommissionPhase {
  id: string;
  structureId: string;
  order: number;
  label: string;
  rate: number;
  minValue?: number | null;
  maxValue?: number | null;
  created_at: string;
}

export interface CommissionStructure {
  id: string;
  name: string;
  appliesTo: CommissionBeneficiaryType;
  status: CommissionStructureStatus;
  ownerAccountId?: string | null;
  phases?: CommissionPhase[];
  created_at: string;
  updated_at: string;
}

export interface CreateCommissionStructureRequest {
  name: string;
  appliesTo: CommissionBeneficiaryType;
  ownerAccountId?: string;
}

export interface UpdateCommissionStructureRequest {
  name?: string;
  ownerAccountId?: string;
}

export interface CreateCommissionPhaseRequest {
  order: number;
  label: string;
  rate: number;
  minValue?: number;
  maxValue?: number;
}

export interface UpdateCommissionPhaseRequest {
  order?: number;
  label?: string;
  rate?: number;
  minValue?: number;
  maxValue?: number;
}

export interface AssignCommissionStructureRequest {
  beneficiaryType: CommissionBeneficiaryType;
  beneficiaryId: string;
}

export interface CommissionAssignment {
  id: string;
  structureId: string;
  beneficiaryType: CommissionBeneficiaryType;
  beneficiaryId: string;
  created_at: string;
}

export interface CommissionEarning {
  id: string;
  beneficiaryType: CommissionBeneficiaryType;
  beneficiaryId: string;
  businessId: string;
  status: CommissionEarningStatus;
  amount: number;
  territory?: string | null;
  sector?: string | null;
  plan?: string | null;
  revenueType?: string | null;
  payoutStatus?: string | null;
  referralCode?: string | null;
  reason?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CommissionEarningsFilters {
  page?: number;
  limit?: number;
  business?: string;
  status?: CommissionEarningStatus;
  territory?: string;
  sector?: string;
  plan?: string;
  revenueType?: string;
  payoutStatus?: string;
  referralCode?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface CommissionEarningsMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CommissionEarningsData {
  data: CommissionEarning[];
  meta: CommissionEarningsMeta;
}

export interface ReasonRequest {
  reason: string;
}

export interface AdjustCommissionEarningRequest {
  amount: number;
  reason?: string;
}

export interface CommissionPayout {
  id: string;
  beneficiaryType: CommissionBeneficiaryType;
  beneficiaryId: string;
  status: CommissionPayoutStatus;
  totalAmount: number;
  payoutReference?: string | null;
  earningIds: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateCommissionPayoutRequest {
  earningIds: string[];
}

export interface MarkPayoutPaidRequest {
  payoutReference: string;
}

export interface CommissionDashboardTopBeneficiary {
  id: string;
  name: string;
  totalEarned: number;
}

export interface CommissionDashboardCountryBreakdown {
  country: string;
  totalEarned: number;
}

export interface CommissionDashboardTrendPoint {
  period: string;
  totalEarned: number;
}

export interface CommissionDashboardSummary {
  byStatus: Record<string, number>;
  topPartners: CommissionDashboardTopBeneficiary[];
  topGlobalSalesAgents: CommissionDashboardTopBeneficiary[];
  byCountry: CommissionDashboardCountryBreakdown[];
  trend: CommissionDashboardTrendPoint[];
}

export interface CommissionBeneficiaryAssignmentsData {
  data: CommissionAssignment[];
}

export interface CommissionPayoutsMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface CommissionPayoutsData {
  data: CommissionPayout[];
  meta: CommissionPayoutsMeta;
}

export type GetCommissionStructuresResponse = ApiAdminResponse<CommissionStructure[]>;
export type CreateCommissionStructureResponse = ApiAdminResponse<CommissionStructure>;
export type GetOneCommissionStructureResponse = ApiAdminResponse<CommissionStructure>;
export type UpdateCommissionStructureResponse = ApiAdminResponse<CommissionStructure>;
export type UpdateCommissionStructureStatusResponse = ApiAdminResponse<CommissionStructure>;
export type CreateCommissionPhaseResponse = ApiAdminResponse<CommissionPhase>;
export type UpdateCommissionPhaseResponse = ApiAdminResponse<CommissionPhase>;
export type DeleteCommissionPhaseResponse = ApiAdminResponse<{ success: boolean; message: string }>;
export type AssignCommissionStructureResponse = ApiAdminResponse<CommissionAssignment>;
export type UnassignCommissionStructureResponse = ApiAdminResponse<{ success: boolean; message: string }>;
export type GetCommissionBeneficiaryAssignmentsResponse = ApiAdminResponse<CommissionBeneficiaryAssignmentsData>;
export type GetCommissionEarningsResponse = ApiAdminResponse<CommissionEarningsData>;
export type CommissionEarningActionResponse = ApiAdminResponse<CommissionEarning>;
export type GetCommissionPayoutsResponse = ApiAdminResponse<CommissionPayoutsData>;
export type GetOneCommissionPayoutResponse = ApiAdminResponse<CommissionPayout>;
export type CreateCommissionPayoutResponse = ApiAdminResponse<CommissionPayout>;
export type CommissionPayoutActionResponse = ApiAdminResponse<CommissionPayout>;
export type GetCommissionDashboardResponse = ApiAdminResponse<CommissionDashboardSummary>;
