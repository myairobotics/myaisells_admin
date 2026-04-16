import type { User } from 'next-auth';
import type { Business } from '@/types';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getBaseUrl } from '@/utils/Helpers';

const API_BASE_URL = getBaseUrl();

export type ExtendedUser = {
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  isBucketOwner: boolean;
  user: User;
  business?: Business;
  businesses?: Business[];
} & User;

async function fetchUserProfile(accessToken: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Profile Fetch Error] Data:', data);
      throw new Error(data.message || 'Failed to fetch user profile');
    }
    console.log('[Profile Fetch] Data:', data);
    return data;
  } catch (error: any) {
    console.error('[Profile Fetch Error]:', error.message || error);
    throw new Error('Could not retrieve user profile.');
  }
}

async function login(credentials: { email: string; password: string }) {
  const url = `${API_BASE_URL}/auth/login`;
  let res: Response;

  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  } catch (error: any) {
    throw new Error(`Network error contacting ${url}: ${error.message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  let authData: any;
  try {
    authData = await res.json();
  } catch {
    throw new Error('Login response is not valid JSON');
  }

  const { token: tokenData, is_bucket_owner } = authData;
  if (!tokenData?.token || !tokenData?.refresh_token) {
    throw new Error('Login response missing token data');
  }

  const { token, refresh_token, expires } = tokenData;

  const profileData = await fetchUserProfile(token);

  const { businesses: rawBusinesses, ...userData } = profileData;
  const minifiedBusinesses = (rawBusinesses || []).map((b: any) => {
    const { description, ...rest } = b;
    return rest;
  });

  const userId = minifiedBusinesses?.[0]?.owner_id || userData.email || 'unknown';

  return {
    id: userId,
    user: userData,
    business: minifiedBusinesses?.[0],
    businesses: minifiedBusinesses,
    accessToken: token,
    refreshToken: refresh_token,
    accessTokenExpires: Date.now() + expires * 1000,
    isBucketOwner: is_bucket_owner,
  };
}

async function refreshAccessToken(token: any) {
  if (!token.refreshToken) {
    console.error('No refresh token available.');
    return { ...token, error: 'NoRefreshToken' };
  }

  try {
    const res = await fetch(`${API_BASE_URL}/auth/tokens/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: token.refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error('[Refresh Error] Data:', data);
      throw new Error(data?.message || 'Failed to refresh token');
    }

    return {
      ...token,
      accessToken: data.token,
      accessTokenExpires: Date.now() + data.expires * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error('[Refresh Token Error]:', error);
    return { ...token, error: 'RefreshAccessTokenError' };
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/signin' },
  trustHost: true,

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginResponse = await login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          if (
            !loginResponse.accessToken
            || !loginResponse.refreshToken
            || typeof loginResponse.accessTokenExpires !== 'number'
            || !loginResponse.user
          ) {
            console.error('[Auth] Incomplete login response');
            return null;
          }

          return {
            id: loginResponse.id,
            accessToken: loginResponse.accessToken,
            refreshToken: loginResponse.refreshToken,
            accessTokenExpires: loginResponse.accessTokenExpires,
            isBucketOwner: loginResponse.isBucketOwner,
            user: loginResponse.user,
            business: loginResponse.business,
            businesses: loginResponse.businesses,
          } as ExtendedUser;
        } catch (error: any) {
          console.error('[Auth] Authorize failed:', error?.message || error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session) {
        return { ...token, ...session };
      }

      if (user) {
        const u = user as ExtendedUser;
        return {
          ...token,
          ...u,
          refreshToken: u.refreshToken,
          accessToken: u.accessToken,
          accessTokenExpires: u.accessTokenExpires,
          isBucketOwner: u.isBucketOwner,
          user: u.user,
          business: u.business,
          businesses: u.businesses,
        };
      }

      if (token.accessTokenExpires && typeof token.accessTokenExpires === 'number' && Date.now() < token.accessTokenExpires) {
        return token;
      }

      return await refreshAccessToken(token);
    },

    async session({ session, token }) {
      const t = token as any;
      return {
        ...session,
        user: t.user,
        business: t.business,
        businesses: t.businesses,
        accessToken: t.accessToken,
        refreshToken: t.refreshToken,
        accessTokenExpires: t.accessTokenExpires,
        isBucketOwner: t.isBucketOwner,
      };
    },
  },
});
