import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import createNextIntlPlugin from 'next-intl/plugin';
import { Env } from './src/libs/Env';

const baseConfig: NextConfig = {
  devIndicators: {
    position: 'bottom-right',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  reactCompiler: true,
  outputFileTracingIncludes: {
    '/': ['./migrations/**/*'],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },

  compiler: {
    removeConsole: Env.NODE_ENV === 'production' || Env.NODE_ENV === 'demo',
  },

  turbopack: {
    rules: {
      '*.svg': {
        loaders: [
          {
            loader: '@svgr/webpack',
            options: {
              icon: true,
            },
          },
        ],
        as: '*.js',
      },
    },
  },
};

let configWithPlugins = createNextIntlPlugin('./src/libs/I18n.ts')(baseConfig);

if (Env.ANALYZE) {
  configWithPlugins = withBundleAnalyzer()(configWithPlugins);
}

if (!Env.NEXT_PUBLIC_SENTRY_DISABLED) {
  configWithPlugins = withSentryConfig(configWithPlugins, {
    org: Env.SENTRY_ORGANIZATION,
    project: Env.SENTRY_PROJECT,

    silent: !Env.CI,

    widenClientFileUpload: true,

    reactComponentAnnotation: {
      enabled: true,
    },

    tunnelRoute: '/monitoring',

    disableLogger: true,

    telemetry: false,
  });
}

const nextConfig = configWithPlugins;
export default nextConfig;
