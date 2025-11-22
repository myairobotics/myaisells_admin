import { Env } from '@/libs/Env';
import { routing } from '@/libs/I18nRouting';

export const getAppUrl = () => {
  if (Env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    return Env.NEXT_PUBLIC_PROD_APP_URL || `https://${Env.VERCEL_PROJECT_PRODUCTION_URL || 'app.myairesource.us'}`;
  }

  if (Env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
    return Env.NEXT_PUBLIC_STAGING_APP_URL || `https://${Env.VERCEL_URL || 'staging-app.myairesource.us'}`;
  }

  if (Env.NEXT_PUBLIC_ENVIRONMENT === 'demo') {
    return Env.NEXT_PUBLIC_DEMO_APP_URL || `https://${Env.VERCEL_URL || 'demo-app.myairesource.us'}`;
  }

  return Env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
};

const defaultApiVersionPath = '/api/v1';
export const getBaseUrl = (API_VERSION_PATH: string = defaultApiVersionPath) => {
  if (Env.NEXT_PUBLIC_ENVIRONMENT === 'production') {
    const baseUrl = Env.NEXT_PUBLIC_PROD_URL || `https://${Env.VERCEL_PROJECT_PRODUCTION_URL || 'prod.myairesource.us'}`;
    return `${baseUrl}${API_VERSION_PATH}`;
  }

  if (Env.NEXT_PUBLIC_ENVIRONMENT === 'staging') {
    const baseUrl = Env.NEXT_PUBLIC_STAGING_URL || `https://${Env.VERCEL_URL || 'staging.myairesource.us'}`;
    return `${baseUrl}${API_VERSION_PATH}`;
  }

  if (Env.NEXT_PUBLIC_ENVIRONMENT === 'demo') {
    const baseUrl = Env.NEXT_PUBLIC_DEMO_URL || `https://${Env.VERCEL_URL || 'demo.myairesource.us'}`;
    return `${baseUrl}${API_VERSION_PATH}`;
  }

  const baseUrl = Env.NEXT_PUBLIC_DEMO_URL || 'http://localhost:3000';
  return `${baseUrl}${API_VERSION_PATH}`;
};

/**
 * Returns a localized path for a given URL and locale
 */
export const getI18nPath = (url: string, locale: string) => {
  if (locale === routing.defaultLocale) {
    return url;
  }
  return `/${locale}${url}`;
};

/**
 * Checks if the current execution is on the server
 */
export const isServer = () => typeof window === 'undefined';
