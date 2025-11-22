import type { MetadataRoute } from 'next';
import { getAppUrl } from '@/utils/Helpers';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: '/dashboard',
    },
    sitemap: `${getAppUrl()}/sitemap.xml`,
  };
}
