import type { ApiAdminResponse } from './api';

export interface AuditDeviceInfo {
  origin: string | null;
  referer: string | null;
  userAgent: string;
}

export interface AuditActor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  pool: string;
  role: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  targetType: string | null;
  targetId: string | null;
  oldValue: unknown;
  newValue: unknown;
  ipAddress: string;
  deviceInfo: AuditDeviceInfo;
  supportSessionId: string | null;
  reason: string | null;
  status: string;
  created_at: string;
  actorPool: string;
  actor: AuditActor;
}

export interface AuditLogsMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface AuditByPool {
  actor_pool: string;
  count: string;
}

export interface AuditByStatus {
  status: string;
  count: string;
}

export interface AuditTopAction {
  action: string;
  count: string;
}

export interface AuditStats {
  total: number;
  byPool: AuditByPool[];
  byStatus: AuditByStatus[];
  topActions: AuditTopAction[];
}

export interface AuditLogsFilters {
  pool?: string;
  action?: string;
  module?: string;
  status?: string;
  actorId?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogsData {
  data: AuditLog[]; // flat array (no nested meta in this response)
}

export type GetAuditLogsResponse = {
  success: boolean;
  data: AuditLog[];
  meta: AuditLogsMeta;
};
export type GetAuditStatsResponse = ApiAdminResponse<AuditStats>;
export type GetOneAuditLogResponse = ApiAdminResponse<AuditLog>;
export type GetActorLogsResponse = { success: boolean; data: AuditLog[] };
