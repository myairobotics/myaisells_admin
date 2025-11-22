import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { auth } from './libs/auth';
import { routing } from './libs/I18nRouting';

export const handleI18nRouting = createMiddleware(routing);

export async function authMiddleware(req: NextRequest): Promise<NextResponse> {
  const session = await auth();
  const accessToken = session?.accessToken;
  const isAuth = Boolean(accessToken);

  const res = handleI18nRouting(req);

  const url = req.nextUrl;
  const { pathname } = url;

  const segments = pathname.split('/').filter(Boolean);
  const localePrefix = routing.locales.includes(segments[0] ?? routing.defaultLocale);
  const locale = localePrefix ? (segments[0] ?? routing.defaultLocale) : routing.defaultLocale;

  const restPath = `/${segments.slice(localePrefix ? 1 : 0).join('/')}`;

  const supportedLocales = new Set(routing.locales);

  if (pathname === '/' || (supportedLocales.has(locale) && restPath === '/')) {
    return res;
  }

  if (restPath.startsWith('/auth')) {
    return isAuth
      ? NextResponse.redirect(new URL(`/${locale}/home`, req.url))
      : res;
  }

  if (!isAuth && !restPath.startsWith('/auth')) {
    const from = restPath + req.nextUrl.search;

    const to = new URL(`/${locale}/auth/signin?from=${encodeURIComponent(from)}`, req.url);

    return NextResponse.redirect(to);
  }

  return handleI18nRouting(req);
}

export default function proxy(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req);
}

export const config = {
  matcher: [
    '/',
    '/((?!api|_next|.*\\..*).*)',
    '/(en|fr|es)/home/:path*',
    '/(en|fr|es)/auth/:path*',
    '/(en|fr|es)',
  ],
};
