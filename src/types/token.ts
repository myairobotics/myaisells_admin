import type { ApiAdminResponse } from './api';

export type TokenTransactionType = 'topup' | 'deduct' | 'allocation' | 'refund' | 'expiry';

export interface TokenAllocation {
  id: string;
  business_id: string;
  business_name: string;
  allocated_tokens: number;
  consumed_tokens: number;
  remaining_tokens: number;
  last_topup_at?: string | null;
  created_at: string;
}

export interface TokenTransaction {
  id: string;
  business_id: string;
  business_name: string;
  type: TokenTransactionType;
  amount: number;
  balance_after: number;
  performed_by?: string;
  note?: string;
  created_at: string;
}

export interface TokenAllocationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface TokenSummary {
  total_allocated: number;
  total_consumed: number;
  total_remaining: number;
  active_businesses: number;
}

export interface TokenAllocationListData {
  data: TokenAllocation[];
  meta: TokenAllocationMeta;
  summary?: TokenSummary;
}

export interface TokenTransactionListData {
  data: TokenTransaction[];
  meta: TokenAllocationMeta;
}

export type GetTokenAllocationsResponse = ApiAdminResponse<TokenAllocationListData>;
export type GetTokenTransactionsResponse = ApiAdminResponse<TokenTransactionListData>;
