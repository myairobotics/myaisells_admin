import type { ApiAdminResponse } from './api';

export type SubscriptionPlanStatus = 'active' | 'inactive' | 'archived';
export type BillingInterval = 'monthly' | 'annual' | 'lifetime';

export interface PlanFeature {
  label: string;
  included: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price_monthly: number;
  price_annual?: number;
  token_allowance: number;
  max_users?: number;
  max_campaigns?: number;
  status: SubscriptionPlanStatus;
  is_popular?: boolean;
  features: PlanFeature[];
  created_at: string;
}

export interface PlatformConfig {
  platform_name: string;
  support_email: string;
  support_url?: string;
  trial_period_days: number;
  grace_period_days: number;
  default_token_allocation: number;
  allow_self_signup: boolean;
  require_email_verification: boolean;
  maintenance_mode: boolean;
  updated_at: string;
}

export type GetSubscriptionPlansResponse = ApiAdminResponse<SubscriptionPlan[]>;
export type GetPlatformConfigResponse = ApiAdminResponse<PlatformConfig>;
