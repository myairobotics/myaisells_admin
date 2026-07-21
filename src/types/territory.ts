import type { ApiAdminResponse } from './api';
import type { AdminBusiness } from './business';

export type TerritoryType = 'country' | 'region' | 'state' | 'city';

export interface Territory {
  id: string;
  name: string;
  type: TerritoryType;
  parentId: string | null;
  parent?: Territory | null;
  children?: Territory[];
  created_at: string;
  updated_at: string;
}

export interface TerritoryListPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateTerritoryRequest {
  name: string;
  type: TerritoryType;
  parentId?: string;
}

export interface UpdateTerritoryRequest {
  name?: string;
  type?: TerritoryType;
  parentId?: string;
}

export type TerritoryOwnerType = 'admin' | 'partner' | 'partner_team_member';

export interface AssignTerritoryRequest {
  ownerType: TerritoryOwnerType;
  ownerId: string;
}

export interface TerritoryAssignment {
  id: string;
  territoryId: string;
  ownerType: TerritoryOwnerType;
  ownerId: string;
  created_at: string;
}

export interface TerritoryActionResponse {
  success: boolean;
  message: string;
}

/** Same shape as the plain business list, filtered to the caller's assigned territories. */
export type TerritoryBusiness = AdminBusiness;

export interface TerritoryBusinessesData {
  data: TerritoryBusiness[];
  pagination: TerritoryListPagination;
}

export type GetTerritoryBusinessesResponse = ApiAdminResponse<TerritoryBusinessesData>;
export type GetTerritoriesResponse = ApiAdminResponse<Territory[]>;
export type GetOneTerritoryResponse = ApiAdminResponse<Territory>;
export type CreateTerritoryResponse = ApiAdminResponse<Territory>;
export type UpdateTerritoryResponse = ApiAdminResponse<Territory>;
export type DeleteTerritoryResponse = ApiAdminResponse<TerritoryActionResponse>;
export type AssignTerritoryResponse = ApiAdminResponse<TerritoryAssignment>;
export type UnassignTerritoryResponse = ApiAdminResponse<TerritoryActionResponse>;
export type GetTerritoryAssignmentsResponse = ApiAdminResponse<TerritoryAssignment[]>;
