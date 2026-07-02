import type { ApiAdminResponse } from './api';

export interface AdminManagementStats {
  totalAdmins: number;
  activeAdmins: number;
  inactiveAdmins: number;
  pendingInvites: number;
  acceptedInvites: number;
  cancelledInvites: number;
}

export interface AdminRole {
  id: string;
  name: string;
  label: string;
  description: string;
  pool: string;
  isSystem: boolean;
  isEditable: boolean;
  created_at: string;
  updated_at: string;
}

export interface AdminAccount {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdBy: string;
  created_at: string;
  updated_at: string;
  role: AdminRole;
}

export interface AdminPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminsListData {
  admins: AdminAccount[];
  pagination: AdminPagination;
}

export type AdminInviteStatus = 'pending' | 'accepted' | 'cancelled' | 'expired';

export interface AdminInvite {
  id: string;
  invited_by_id: string;
  role_id: string;
  email: string;
  first_name: string;
  token: string;
  status: AdminInviteStatus;
  expires_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AdminInvitesListData {
  invites: AdminInvite[];
  pagination: AdminPagination;
}

export interface InviteAdminRequest {
  email: string;
  role_id: string;
  first_name: string;
}

export interface InviteAdminData {
  email: string;
  first_name: string;
}

export interface ResendAdminInviteData {
  invite_id: string;
  email: string;
  invite_url: string;
  expires_at: string;
}

export interface ValidateInviteTokenData {
  invitation_id: string;
  email: string;
  first_name: string;
  role_id: string;
  expires_at: string;
}

export interface AcceptAdminInviteRequest {
  token: string;
  first_name: string;
  last_name: string;
  password: string;
  invitation_id: string;
}

export interface AcceptAdminInviteData {
  admin_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role_id: string;
}

export interface AdminActionResponse {
  success: boolean;
  message: string;
}

export type GetAdminManagementStatsResponse = ApiAdminResponse<AdminManagementStats>;
export type GetAdminsResponse = ApiAdminResponse<AdminsListData>;
export type GetAdminResponse = ApiAdminResponse<AdminAccount>;
export type InviteAdminResponse = ApiAdminResponse<InviteAdminData>;
export type GetAdminInvitesResponse = ApiAdminResponse<AdminInvitesListData>;
export type ResendAdminInviteResponse = ApiAdminResponse<ResendAdminInviteData>;
export type ValidateInviteTokenResponse = ApiAdminResponse<ValidateInviteTokenData>;
export type AcceptAdminInviteResponse = ApiAdminResponse<AcceptAdminInviteData>;
