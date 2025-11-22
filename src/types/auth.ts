import type { ApiResponse } from './api';
import type { User } from './user';

export type Profile = { user: User };

export type LoginRequest = {
  email: string;
  password: string;
};

export type TokenData = {
  token: string;
  refresh_token: string;
  expires: number;
};

export type AuthResponse = ApiResponse<{
  token: TokenData;
  is_bucket_owner: boolean;
  profile: Profile;
}>;
