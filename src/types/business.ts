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
  industry?: string;
  status: BusinessStatus;
  subscription_plan?: string;
  token_balance?: number;
  partner_id?: string;
  sales_agent_id?: string;
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

export type GetAdminBusinessesResponse = ApiAdminResponse<AdminBusinessListData>;
