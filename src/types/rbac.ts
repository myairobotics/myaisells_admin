import type { ApiAdminResponse } from './api';

export interface Permission {
  id: string;
  permKey: string;
  name: string;
  description: string;
  group: string;
  isSystem: boolean;
  created_at: string;
  updated_at: string;
}

export interface RolePermissionDetail extends Permission {
  RolePermission: {
    grantedBy: string | null;
  };
}

export interface Role {
  id: string;
  name: string;
  label: string;
  description: string;
  pool: string;
  isSystem: boolean;
  isEditable: boolean;
  created_at: string;
  updated_at: string;
  permissions: RolePermissionDetail[];
}

export interface CreatePermissionRequest {
  key: string;
  name: string;
  description: string;
  group: string;
}

export interface AddPermissionsToRoleRequest {
  permissionIds: string[];
}

export type GetPermissionsResponse = ApiAdminResponse<Permission[]>;
export type GetOnePermissionResponse = ApiAdminResponse<Permission>;
export type CreatePermissionResponse = ApiAdminResponse<Permission>;
export type GetRolesResponse = ApiAdminResponse<Role[]>;
export type AddPermissionsToRoleResponse = ApiAdminResponse<unknown>;
export type FlushPermissionCacheResponse = { success: boolean; message: string };
