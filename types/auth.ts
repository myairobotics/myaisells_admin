export interface User {
  id: number;
  first_name: string;
  last_name: string;
  is_staff: string;
  date_joined: string;
  role: string;
  email: string;
  work_email: string;
  title: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  user: Business;
}

export interface TokenData {
  token: string;
  expires: number;
  refresh_token: string;
}

export interface AuthResponse {
  token: TokenData;
  message: string;
  status: string;
  is_bucket_owner: boolean;
  profile: Profile;
}
export interface Business {
  id: number;
  logo: string;
  name: string;
  phone: string;
  website: string;
  year_founded: number;
  address: string;
  country: string;
  bucket_id: number;
  business_sector_id: number;
  description: string;
  business_email: string;
  owner_id: number;
  tag: string;
  offering: string;
  created_at: string;
  updated_at: string;
}

export type BusinessResponse = Business[];
