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

    return data;
  } catch (error: any) {
    console.error('[Profile Fetch Error]:', error.message || error);
    throw new Error('Could not retrieve user profile.');
  }
}

async function login(credentials: { email: string; password: string }) {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    const authData = await res.json();

    if (!res.ok) {
      console.error('[Login Error] Data:', authData);
      throw new Error(authData.message || 'Login failed');
    }

    const { token: tokenData, is_bucket_owner } = authData;
    const { token, refresh_token, expires } = tokenData;

    const userProfile = await fetchUserProfile(token);

    return {
      user: userProfile,
      business: userProfile.businesses?.[0],
      businesses: userProfile.businesses,
      accessToken: token,
      refreshToken: refresh_token,
      accessTokenExpires: Date.now() + expires * 1000,
      isBucketOwner: is_bucket_owner,
    };
  } catch (err: any) {
    console.error('[Login Function] Error:', err.message || err);
    throw new Error(err.message || 'Invalid login credentials');
  }
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

  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<ExtendedUser | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        const loginResponse = await login({
          email: credentials.email as string,
          password: credentials.password as string,
        });

        return {
          accessToken: loginResponse.accessToken,
          refreshToken: loginResponse.refreshToken,
          accessTokenExpires: loginResponse.accessTokenExpires,
          isBucketOwner: loginResponse.isBucketOwner,
          user: loginResponse.user,
          business: loginResponse.business,
          businesses: loginResponse.businesses,
        } as ExtendedUser;
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
