import type { ApiAdminResponse } from './api';

export interface Partner {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: string;
  last_login_at: string | null;
}

export interface PartnerListItem {
  id: string;
  first_name: string;
  last_name: string;
  status: string;
}

export interface CreatePartnerRequest {
  first_name: string;
  last_name: string;
  email: string;
  region: string;
  tag: string;
  password: string;
}

export interface CreatePartnerResponse {
  success: boolean;
  message: string;
}

export interface PartnerPaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PartnerListData {
  data: PartnerListItem[];
  meta: PartnerPaginationMeta;
}

export type GetAllPartnersResponse = ApiAdminResponse<PartnerListData>;
export type GetOnePartnerResponse = ApiAdminResponse<Partner>;
