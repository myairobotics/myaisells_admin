import type { AdminBusinessDetail } from './business';

/**
 * Unlike every other admin route, this controller (shared with the Partner
 * Business Support surface) returns bare JSON, with no `{ success, data }`
 * envelope. Verified against the live API on 2026-07-20.
 */
export type GetBusinessSupportOverviewResponse = AdminBusinessDetail;

export interface BusinessSupportProfile {
  id: string;
  logo: string;
  name: string;
  phone: string;
  website: string;
  year_founded: number;
  address: string;
  country: string;
  bucket_id: string;
  business_sector_id: string;
  description: string;
  business_email: string;
  owner_id: string;
  tag: string;
  territory_id: string | null;
  completed_at: string | null;
  offering: string;
  created_at: string;
  updated_at: string;
}

export type GetBusinessProfileResponse = BusinessSupportProfile;
export type UpdateBusinessProfileResponse = BusinessSupportProfile;

/**
 * Generic fallback shape for sub-resources without a more specific type below.
 */
export interface BusinessSupportEntity {
  id: string;
  [key: string]: unknown;
}

/**
 * Verified by creating and immediately deleting a real record against the
 * live API on 2026-07-20 (then confirmed re-fetching returns []). Creating a
 * product with this exact shape (name, description, price) consistently
 * returns a 500 "An error occurred while processing request". That's a
 * server-side bug in this environment, not a client-side field mismatch, so
 * the create form is left in but flagged.
 */
export interface BusinessProduct {
  id: string;
  name: string;
  description: string;
  price?: number;
  bucket_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSupportInfo {
  id: string;
  phone: string;
  email: string;
  live_chat: boolean;
  ticket_system: boolean;
  options: unknown;
  bucket_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessDepartment {
  id: string;
  name: string;
  description: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessProductExpert {
  id: string;
  fullname: string;
  email: string;
  position: string;
  department_id: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessTextContent {
  id: string;
  header: string;
  content: string;
  owner_id: string | null;
  owner_type: string | null;
  bucket_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessSalesCampaign {
  id: string;
  name: string;
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
}

export type BusinessAgentAvatar = BusinessSupportEntity;

export interface BusinessFaq {
  id: string;
  question: string;
  answer: string;
  bucket_id: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessFolder {
  id: string;
  name: string;
  description: string | null;
  bucket_id: string;
  section: string;
  campaign_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface BusinessKnowledgeBaseSource {
  id: string;
  path: string;
  name: string;
  size: number | null;
  content_type: string;
  bucket_id: string;
  owner_id: string | null;
  owner_type: string | null;
  error: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessWorkingHour {
  id: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  disabled: boolean;
  description: string | null;
}

export interface BusinessAgentLanguage {
  language_code: string;
}

export type GetAgentLanguageResponse = BusinessAgentLanguage;
export type UpdateAgentLanguageResponse = BusinessAgentLanguage;
export type GetAgentAvatarsResponse = BusinessAgentAvatar[];
export type GetOneAgentAvatarResponse = BusinessAgentAvatar;
export type UpdateAgentAvatarResponse = BusinessAgentAvatar;
export type GetWorkingHoursResponse = BusinessWorkingHour[];

export interface UpdateAgentAvatarRequest {
  name?: string;
  gender?: string;
}

export interface UpdateAgentLanguageRequest {
  language_code: string;
}

export interface CreateWorkingHourRequest {
  day_of_week: string;
  start_time: string;
  end_time: string;
  disabled?: boolean;
}

export interface UpdateWorkingHourRequest {
  start_time?: string;
  end_time?: string;
  disabled?: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price?: number;
}

export interface CreateSupportInfoRequest {
  phone: string;
  email: string;
  live_chat?: boolean;
  ticket_system?: boolean;
}

export interface CreateDepartmentRequest {
  name: string;
  description: string;
}

export interface CreateProductExpertRequest {
  fullname: string;
  email: string;
  position: string;
  department_id: string;
}

export interface CreateTextContentRequest {
  header: string;
  content: string;
  folder_id?: string;
}

export interface CreateSalesCampaignRequest {
  name: string;
  discount_type: string;
  discount_value: number;
  start_date: string;
  end_date: string;
}

export interface BusinessSupportActionResponse {
  success: boolean;
  message: string;
}

/**
 * Every DELETE (and the working-hours `reset`) on this controller is a
 * "restricted action": the backend requires `confirm=true` AND a non-empty
 * `reason`, both passed as query-string parameters (a body is not read on
 * DELETE). Verified against the live API on 2026-07-20; omitting either
 * returns a 400 explaining what's missing.
 */
export interface RestrictedActionParams {
  reason: string;
}

export type ListEntityResponse<T> = T[];
export type OneEntityResponse<T> = T;
export type DeleteEntityResponse = BusinessSupportActionResponse;
export type ScrapeKnowledgeBaseResponse = BusinessSupportActionResponse;
export type ResetWorkingHoursResponse = BusinessSupportActionResponse;
export type ToggleWorkingHoursDayResponse = BusinessSupportActionResponse;
