import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { getSession } from 'next-auth/react';
import { getBaseUrl } from '@/utils/Helpers';

const baseUrl = getBaseUrl();

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: async (headers) => {
    const session = await getSession();
    const token = session?.accessToken;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    headers.set('Accept', 'application/json');
    return headers;
  },
});

// const AUTH_ERROR_MESSAGES = ['invalid token', 'token expired', 'invalid access token', 'jwt expired', 'expired token', 'not authenticated'];

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  // if (result.error?.status === 401) {
  //   const url = typeof args === 'string' ? args : args.url;
  //   const message: string = (result.error.data as any)?.message?.toLowerCase() ?? '';
  //   const isAuthError = AUTH_ERROR_MESSAGES.some(phrase => message.includes(phrase));

  //   console.log('[baseApi] 401 received', { url, message, isAuthError });

  //   if (isAuthError) {
  //     console.log('[baseApi] auth error confirmed, calling signOut');
  //     signOut({ callbackUrl: '/auth/signin' });
  //   }
  // }
  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'User',
    'Partner',
    'Business',
    'SalesAgent',
    'Token',
    'SupportSession',
    'Referral',
    'Setting',
    'Permission',
    'Role',
    'AuditLog',
    'AdminManagement',
    'Territory',
    'Commission',
    'Billing',
    'Security',
    'Notification',
    'Currency',
    'BusinessSupport',
  ],
  endpoints: () => ({}),
});
