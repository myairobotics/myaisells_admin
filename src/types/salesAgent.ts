import type { ApiAdminResponse } from './api';

export type SalesAgentStatus = 'active' | 'pending' | 'suspended' | 'deactivated' | 'archived';

export type SalesAgentType = 'global' | 'partner';

export interface SalesAgent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  status: SalesAgentStatus;
  agent_type: SalesAgentType;
  country?: string;
  region?: string;
  state?: string;
  city?: string;
  referral_code?: string;
  parent_account_id?: string;
  partner_name?: string;
  assigned_businesses_count?: number;
  created_by?: string;
  last_login_at?: string | null;
  created_at: string;
}

export interface SalesAgentMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SalesAgentListData {
  data: SalesAgent[];
  meta: SalesAgentMeta;
}

export type GetSalesAgentsResponse = ApiAdminResponse<SalesAgentListData>;
