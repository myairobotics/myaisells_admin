import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { auth } from './libs/auth';
import { routing } from './libs/I18nRouting';

const i18nMiddleware = createMiddleware(routing);

export async function authMiddleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  const session = await auth();
  const isAuth = Boolean(session?.user) && Boolean(session?.accessToken);

  const segments = pathname.split('/').filter(Boolean);
  const hasLocale = routing.locales.includes(segments[0] ?? '');
  const locale = hasLocale ? segments[0] : routing.defaultLocale;
  const restPath = `/${segments.slice(hasLocale ? 1 : 0).join('/')}`;

  if (restPath === '/') {
    return NextResponse.redirect(
      new URL(isAuth ? `/${locale}/home` : `/${locale}/auth/signin`, req.url),
    );
  }

  if (restPath.startsWith('/auth')) {
    if (isAuth) {
      return NextResponse.redirect(new URL(`/${locale}/home`, req.url));
    }
    return i18nMiddleware(req);
  }

  if (!isAuth) {
    const from = restPath + search;
    return NextResponse.redirect(
      new URL(`/${locale}/auth/signin?from=${encodeURIComponent(from)}`, req.url),
    );
  }

  return i18nMiddleware(req);
}

export default function proxy(req: NextRequest): Promise<NextResponse> {
  return authMiddleware(req);
}

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
