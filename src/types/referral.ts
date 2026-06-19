import type { ApiAdminResponse } from './api';

export type ReferralCodeStatus = 'active' | 'inactive' | 'expired';
export type ReferralCodeOwnerType = 'partner' | 'sales_agent' | 'admin';

export interface ReferralCode {
  id: string;
  code: string;
  owner_type: ReferralCodeOwnerType;
  owner_id: string;
  owner_name: string;
  total_uses: number;
  successful_conversions: number;
  commission_earned?: number;
  status: ReferralCodeStatus;
  expires_at?: string | null;
  created_at: string;
}

export interface ReferralMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ReferralListData {
  data: ReferralCode[];
  meta: ReferralMeta;
}

export type GetReferralCodesResponse = ApiAdminResponse<ReferralListData>;
