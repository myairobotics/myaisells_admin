import type { ApiAdminResponse } from './api';

export interface TwoFactorStatus {
  enabled: boolean;
}

export interface TwoFactorSetupData {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export interface ConfirmTwoFactorRequest {
  code: string;
}

export interface DisableTwoFactorRequest {
  password: string;
}

export interface SecurityActionResponse {
  success: boolean;
  message: string;
}

export interface SecuritySession {
  id: string;
  ipAddress: string;
  userAgent: string;
  createdAt: string;
  lastSeenAt: string;
  expiresAt: string;
  isCurrent: boolean;
}

export type GetTwoFactorStatusResponse = ApiAdminResponse<TwoFactorStatus>;
export type SetupTwoFactorResponse = ApiAdminResponse<TwoFactorSetupData>;
export type ConfirmTwoFactorResponse = ApiAdminResponse<SecurityActionResponse>;
export type DisableTwoFactorResponse = ApiAdminResponse<SecurityActionResponse>;
export type GetSecuritySessionsResponse = ApiAdminResponse<SecuritySession[]>;
export type RevokeSecuritySessionResponse = ApiAdminResponse<SecurityActionResponse>;
export type RevokeAllOtherSessionsResponse = ApiAdminResponse<SecurityActionResponse>;
