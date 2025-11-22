import type { ApiResponse } from './api';

export type Business = {
  id: number;
  name: string;
  logo: string;
  tag: string;
  offering: string;
  description: string;
  year_founded: number;

  phone: string;
  business_email: string;
  website: string;
  address: string;
  country: string;

  bucket_id: number;
  business_sector_id: number;
  owner_id: number;

  created_at: string;
  updated_at: string;
};

export type BusinessList = Business[];

export type BusinessResponse = ApiResponse<Business>;
export type BusinessListResponse = ApiResponse<BusinessList>;
