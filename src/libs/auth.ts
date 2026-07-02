import type { User } from 'next-auth';
import type { Business } from '@/types';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { getBaseUrl } from '@/utils/Helpers';

const API_BASE_URL = getBaseUrl();

export type ExtendedUser = {
  accessToken: string;
  accessTokenExpiresAt: number | null;
  user: User;
  business?: Business;
  isBucketOwner: boolean;
} & User;

function decodeJwtExpiry(token: string): number | null {
  try {
    const part = token.split('.')[1];
    if (!part) {
      return null;
    }
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

function decodeJwtPayload(token: string): Record<string, any> {
  try {
    const part = token.split('.')[1];
    if (!part) {
      return {};
    }
    const base64 = part.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

async function login(credentials: { email: string; password: string }) {
  const url = `${API_BASE_URL}/admin/auth/login`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15_000);

  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });
  } catch (error: any) {
    const isTimeout = error.name === 'AbortError';
    throw new Error(isTimeout ? 'Login request timed out. Please try again.' : `Network error: ${error.message}`);
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Login failed (${res.status}): ${text}`);
  }

  const authData = await res.json();

  // Response: { success: true, data: { token: "eyJ...", account_type: "admin" } }
  const accessToken: string = authData?.data?.token;
  if (!accessToken) {
    throw new Error('Login response missing token');
  }

  const accessTokenExpiresAt = decodeJwtExpiry(accessToken);
  const jwtPayload = decodeJwtPayload(accessToken);

  // Build user from JWT claims: sub, roleName, pool
  const userData = {
    id: jwtPayload.sub ?? 'unknown',
    role: jwtPayload.roleName,
    roleId: jwtPayload.roleId,
    pool: jwtPayload.pool,
  };

  return {
    id: userData.id,
    user: userData,
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

      // Only signal expiry when expiry is a known, finite timestamp that has passed.
      // If expiry couldn't be decoded from the JWT, stay silent and let API 401s handle logout.
      const expiry = token.accessTokenExpiresAt as number;
      const now = Date.now();

      // console.log('[Auth JWT] token check', {
      //   accessToken: (token.accessToken as string)?.slice(-10),
      //   accessTokenExpiresAt: expiry,
      //   expiresIn: expiry ? `${Math.round((expiry - now) / 1000)}s` : 'unknown',
      //   now,
      //   isExpired: expiry && Number.isFinite(expiry) ? now >= expiry : 'no valid expiry',
      // });

      if (expiry && Number.isFinite(expiry) && now >= expiry) {
        // console.log('[Auth JWT] signalling TokenExpired');
        return { ...token, error: 'TokenExpired' };
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.user = (token as any).user;
      session.isBucketOwner = token.isBucketOwner as boolean;
      if (token.error) {
        session.error = token.error as string;
      }
      return session;
    },
  },
});
