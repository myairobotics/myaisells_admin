import type { User } from 'next-auth';
import type { Business } from '@/types';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getBaseUrl } from '@/utils/Helpers';

const API_BASE_URL = getBaseUrl();

export type ExtendedUser = {
  accessToken: string;
  accessTokenExpiresAt: number;
  user: User;
  business?: Business;
  isBucketOwner: boolean;
} & User;

function decodeJwtExpiry(token: string): number {
  try {
    const part = token.split('.')[1];
    if (!part) {
      throw new Error('Invalid JWT');
    }
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return payload.exp * 1000;
  } catch {
    return Date.now() + 15 * 60 * 1000;
  }
}

async function fetchUserProfile(accessToken: string) {
  const res = await fetch(`${API_BASE_URL}/admin/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error('[Auth] Profile fetch error:', data);
    throw new Error(data.message || 'Failed to fetch user profile');
  }

  return data;
}

async function login(credentials: { email: string; password: string }) {
  const url = `${API_BASE_URL}/admin/auth/login`;

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
  } catch (error: any) {
    throw new Error(`Network error: ${error.message}`);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  const authData = await res.json();

  // Response: { success: true, data: { token: "eyJ...", account_type: "admin" } }
  const accessToken: string = authData?.data?.token;
  if (!accessToken) {
    console.error('[Auth] Missing token in login response:', authData);
    throw new Error('Login response missing token');
  }

  const accessTokenExpiresAt = decodeJwtExpiry(accessToken);

  let profileData: any = null;
  try {
    profileData = await fetchUserProfile(accessToken);
  } catch (err) {
    console.error('[Auth] Could not fetch profile, continuing without it:', err);
  }

  const rawUser = profileData?.data || profileData || {};
  const { businesses: rawBusinesses, ...userData } = rawUser;
  const primaryBusiness = rawBusinesses?.[0]
    ? (({ description: _d, ...rest }: any) => rest)(rawBusinesses[0])
    : undefined;

  const userId = primaryBusiness?.owner_id || userData.email || userData.id || 'unknown';

  return {
    id: userId,
    user: userData,
    business: primaryBusiness,
    accessToken,
    accessTokenExpiresAt,
    isBucketOwner: false,
  };
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
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginResponse = await login({
            email: credentials.email as string,
            password: credentials.password as string,
          });

          return {
            id: loginResponse.id,
            accessToken: loginResponse.accessToken,
            accessTokenExpiresAt: loginResponse.accessTokenExpiresAt,
            isBucketOwner: loginResponse.isBucketOwner,
            user: loginResponse.user,
            business: loginResponse.business,
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
      if (user) {
        const u = user as ExtendedUser;
        token.accessToken = u.accessToken;
        token.accessTokenExpiresAt = u.accessTokenExpiresAt;
        token.isBucketOwner = u.isBucketOwner;
        token.user = u.user;
        token.business = u.business;
        return token;
      }

      if (trigger === 'update' && session) {
        if (session.accessToken) {
          token.accessToken = session.accessToken;
          token.accessTokenExpiresAt = decodeJwtExpiry(session.accessToken as string);
        }
        if (session.user) {
          token.user = { ...(token.user as any), ...session.user };
        }
        return token;
      }

      // Token still valid
      if (Date.now() < (token.accessTokenExpiresAt as number)) {
        return token;
      }

      // No refresh token available for this API — signal expiry
      return { ...token, error: 'TokenExpired' };
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = (token as any).user;
      session.business = (token as any).business;
      session.isBucketOwner = token.isBucketOwner as boolean;
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
  },
});
