import type { ApiAdminResponse, ApiResponse } from './api';

export type Business = {
  id: number;
  name: string;
  logo: string;
  tag: string;
  offering: string;
  description: string;
  year_founded: number;

  phone: string;
  business_email: string;
  website: string;
  address: string;
  country: string;

  bucket_id: number;
  business_sector_id: number;
  owner_id: number;

  created_at: string;
  updated_at: string;
};

export type BusinessList = Business[];

export type BusinessResponse = ApiResponse<Business>;
export type BusinessListResponse = ApiResponse<BusinessList>;

/** `PATCH /businesses/:id/status` accepts a subset of these; the read side never returns a "status" field (see `isActive` / `subscription.status` on `AdminBusiness` instead). */
export type BusinessStatus = 'active' | 'suspended' | 'cancelled';

export interface AdminBusinessAttributionRef {
  id: string;
  name: string;
}

export interface AdminBusinessSubscriptionSummary {
  status: string;
  planName: string;
  amountPaid: number;
  startDate?: string;
  endDate?: string | null;
}

export interface AdminBusiness {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  dateJoined: string;
  businessName: string;
  website: string;
  country: string;
  attributionSource: string;
  partner: AdminBusinessAttributionRef | null;
  salesAgent: AdminBusinessAttributionRef | null;
  subscription: AdminBusinessSubscriptionSummary | null;
  walletBalance: number;
}

export interface AdminBusinessProfile {
  businessName: string;
  logo: string;
  phone: string;
  website: string;
  address: string;
  country: string;
  businessEmail: string;
  description: string;
  offering: string;
}

export interface AdminBusinessAttribution {
  source: string;
  partner: AdminBusinessAttributionRef | null;
  salesAgent: AdminBusinessAttributionRef | null;
}

export interface AdminBusinessSetupProgressItem {
  module: string;
  status: 'COMPLETE' | 'INCOMPLETE';
  missing: string[];
}

export interface AdminBusinessDetail {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  dateJoined: string;
  profile: AdminBusinessProfile;
  attribution: AdminBusinessAttribution;
  subscription: AdminBusinessSubscriptionSummary | null;
  walletBalance: number;
  campaigns: { total: number; active: number };
  appointments: { total: number; completed: number };
  setupProgress: AdminBusinessSetupProgressItem[];
}

export interface AdminBusinessPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminBusinessListData {
  data: AdminBusiness[];
  pagination: AdminBusinessPagination;
}

export interface CreateBusinessRequest {
  name: string;
  email: string;
  phone?: string;
  website?: string;
  country?: string;
  region?: string;
  state?: string;
  address?: string;
  industry?: string;
  contact_person?: string;
  subscription_plan?: string;
}

export interface CreateBusinessOnboardingData {
  business: AdminBusinessDetail;
  temp_password: string;
}

export interface BusinessActionResponse {
  success: boolean;
  message: string;
}

export interface UpdateBusinessStatusRequest {
  status: BusinessStatus;
  reason?: string;
}

export interface BusinessSupportAccessData {
  business: AdminBusinessDetail;
  [key: string]: unknown;
}

export type GetAdminBusinessesResponse = ApiAdminResponse<AdminBusinessListData>;
export type GetAdminBusinessResponse = ApiAdminResponse<AdminBusinessDetail>;
export type CreateBusinessOnboardingResponse = ApiAdminResponse<CreateBusinessOnboardingData>;
export type UpdateBusinessStatusResponse = ApiAdminResponse<AdminBusiness>;
export type BusinessSupportAccessResponse = ApiAdminResponse<BusinessSupportAccessData>;
