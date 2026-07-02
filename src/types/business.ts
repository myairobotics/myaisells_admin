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

export type BusinessStatus = 'active' | 'pending_setup' | 'suspended' | 'cancelled';

export interface AdminBusiness {
  id: string;
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
  status: BusinessStatus;
  subscription_plan?: string;
  token_balance?: number;
  partner_id?: string;
  partner_name?: string;
  sales_agent_id?: string;
  sales_agent_name?: string;
  referral_code?: string;
  created_by?: string;
  setup_completion?: number;
  created_at: string;
  updated_at?: string;
}

export interface AdminBusinessMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AdminBusinessListData {
  data: AdminBusiness[];
  meta: AdminBusinessMeta;
}

export interface BusinessStats {
  total: number;
  active: number;
  pending_setup: number;
  suspended: number;
  cancelled: number;
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
  partner_id?: string;
  sales_agent_id?: string;
  referral_code?: string;
}

export interface BusinessActionResponse {
  success: boolean;
  message: string;
}

export type GetAdminBusinessesResponse = ApiAdminResponse<AdminBusinessListData>;
export type GetAdminBusinessResponse = ApiAdminResponse<AdminBusiness>;
export type GetBusinessStatsResponse = ApiAdminResponse<BusinessStats>;
export type CreateBusinessResponse = ApiAdminResponse<AdminBusiness>;
