import type { ApiAdminResponse } from './api';

export interface Currency {
  id: string;
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCurrencyRequest {
  code: string;
  name: string;
  symbol: string;
  exchangeRate: number;
}

export interface UpdateCurrencyRequest {
  code?: string;
  name?: string;
  symbol?: string;
  exchangeRate?: number;
}

export interface CurrencyActionResponse {
  success: boolean;
  message: string;
}

export type GetCurrenciesResponse = ApiAdminResponse<Currency[]>;
export type GetOneCurrencyResponse = ApiAdminResponse<Currency>;
export type CreateCurrencyResponse = ApiAdminResponse<Currency>;
export type UpdateCurrencyResponse = ApiAdminResponse<Currency>;
export type DeleteCurrencyResponse = ApiAdminResponse<CurrencyActionResponse>;
