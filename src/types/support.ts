import type { ApiAdminResponse } from './api';

export type SupportSessionStatus = 'active' | 'ended' | 'expired' | 'terminated';

export type SupportAccessLevel = 'read_only' | 'limited_write' | 'full_admin';

export interface SupportSession {
  id: string;
  business_id: string;
  business_name: string;
  initiated_by_id: string;
  initiated_by_name: string;
  initiated_by_email: string;
  access_level: SupportAccessLevel;
  reason: string;
  status: SupportSessionStatus;
  started_at: string;
  ended_at?: string | null;
  expires_at?: string | null;
  ip_address?: string;
  notes?: string;
}

export interface SupportSessionMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface SupportSessionListData {
  data: SupportSession[];
  meta: SupportSessionMeta;
}

export type GetSupportSessionsResponse = ApiAdminResponse<SupportSessionListData>;
export type GetSupportSessionResponse = ApiAdminResponse<SupportSession>;
