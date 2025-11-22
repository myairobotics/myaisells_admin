import type { Business } from '@/types';
import type { User as BaseUser } from '@/types/user';

declare module 'next-auth' {
  interface Session {
    user: BaseUser;
    business?: Business;
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
    isBucketOwner?: boolean;
    error?: string;
  }
}
