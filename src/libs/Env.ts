import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  shared: {
    NODE_ENV: z.enum(['development', 'test', 'production', 'demo']).default('development'),
  },

  server: {
    // Core runtime
    NEXT_RUNTIME: z.enum(['nodejs', 'edge']).default('nodejs'),
    CI: z.string().optional(),
    PORT: z.coerce.number().default(3000),

    // Monitoring and logging
    ANALYZE: z.preprocess(val => val === 'true', z.boolean()).default(false),
    BETTER_STACK_SOURCE_TOKEN: z.string().optional().default(''),
    SENTRY_PROJECT: z.string().optional().default(''),
    SENTRY_ORGANIZATION: z.string().optional().default(''),

    // Arcjet
    ARCJET_KEY: z.string().startsWith('ajkey_').optional().default(''),

    // Checkly
    CHECKLY_LOGICAL_ID: z.string().min(3).optional().default(''),
    CHECKLY_PROJECT_NAME: z.string().min(2).optional().default(''),
    CHECKLY_EMAIL_ADDRESS: z.string().email().optional().default(''),

    // Vercel
    VERCEL_URL: z.string().url().optional().default(''),
    VERCEL_PROJECT_PRODUCTION_URL: z.string().url().optional().default(''),
    VERCEL_BYPASS_TOKEN: z.string().optional().default(''),

    // Auth
    NEXTAUTH_URL: z.string().url().optional().default('http://localhost:3000'),
    NEXTAUTH_SECRET: z.string().min(8).optional().default('defaultsecret123'),
    AUTH_TRUST_HOST: z.preprocess(val => val === 'true', z.boolean()).default(false),
  },

  client: {
    NEXT_PUBLIC_ENVIRONMENT: z.enum(['development', 'staging', 'production', 'demo']).default('development'),
    NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_APP_BASE_URL: z.string().url().default('http://localhost:3000'),
    NEXT_PUBLIC_NEW_APP_BASE_URL: z.string().url().optional().default(''),
    NEXT_PUBLIC_DOMAIN_URL: z.string().url().optional().default(''),
    NEXT_PUBLIC_DOMAIN_WEBSITE_URL: z.string().url().optional().default(''),
    NEXT_PUBLIC_URL: z.string().url().optional().default(''),

    NEXT_PUBLIC_PROD_APP_URL: z.string().url().optional().default('https://app.myairesource.us'),
    NEXT_PUBLIC_DEMO_APP_URL: z.string().url().optional().default('https://demo-app.myairesource.us'),
    NEXT_PUBLIC_STAGING_APP_URL: z.string().url().optional().default('https://staging-app.myairesource.us'),

    NEXT_PUBLIC_PROD_URL: z.string().url().optional().default('https://prod.myairesource.us'),
    NEXT_PUBLIC_DEMO_URL: z.string().url().optional().default('https://demo.myairesource.us'),
    NEXT_PUBLIC_STAGING_URL: z.string().url().optional().default('https://staging.myairesource.us'),

    // Sentry
    NEXT_PUBLIC_SENTRY_DSN: z.string().optional().default(''),
    NEXT_PUBLIC_SENTRY_DISABLED: z.preprocess(val => val === 'true', z.boolean()).default(false),

    // Encryption
    NEXT_PUBLIC_ENCRYPTION_KEY: z.string().optional().default(''),
    NEXT_PUBLIC_ENCRYPTION_SALT: z.string().optional().default(''),

    // PostHog
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional().default(''),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().url().optional().default(''),
  },

  runtimeEnv: {
    // Shared
    NODE_ENV: process.env.NODE_ENV,
    CI: process.env.CI,
    PORT: process.env.PORT,
    NEXT_RUNTIME: process.env.NEXT_RUNTIME,

    // Monitoring and logging
    ANALYZE: process.env.ANALYZE,
    BETTER_STACK_SOURCE_TOKEN: process.env.BETTER_STACK_SOURCE_TOKEN,
    SENTRY_PROJECT: process.env.SENTRY_PROJECT,
    SENTRY_ORGANIZATION: process.env.SENTRY_ORGANIZATION,

    // Arcjet
    ARCJET_KEY: process.env.ARCJET_KEY,

    // Checkly
    CHECKLY_LOGICAL_ID: process.env.CHECKLY_LOGICAL_ID,
    CHECKLY_PROJECT_NAME: process.env.CHECKLY_PROJECT_NAME,
    CHECKLY_EMAIL_ADDRESS: process.env.CHECKLY_EMAIL_ADDRESS,

    // Vercel
    VERCEL_URL: process.env.VERCEL_URL,
    VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
    VERCEL_BYPASS_TOKEN: process.env.VERCEL_BYPASS_TOKEN,

    // Auth
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    AUTH_TRUST_HOST: process.env.AUTH_TRUST_HOST,

    // Client
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_APP_BASE_URL: process.env.NEXT_PUBLIC_APP_BASE_URL,
    NEXT_PUBLIC_NEW_APP_BASE_URL: process.env.NEXT_PUBLIC_NEW_APP_BASE_URL,
    NEXT_PUBLIC_DOMAIN_URL: process.env.NEXT_PUBLIC_DOMAIN_URL,
    NEXT_PUBLIC_DOMAIN_WEBSITE_URL: process.env.NEXT_PUBLIC_DOMAIN_WEBSITE_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,

    NEXT_PUBLIC_PROD_APP_URL: process.env.NEXT_PUBLIC_PROD_APP_URL,
    NEXT_PUBLIC_DEMO_APP_URL: process.env.NEXT_PUBLIC_DEMO_APP_URL,
    NEXT_PUBLIC_STAGING_APP_URL: process.env.NEXT_PUBLIC_STAGING_APP_URL,

    NEXT_PUBLIC_PROD_URL: process.env.NEXT_PUBLIC_PROD_URL,
    NEXT_PUBLIC_DEMO_URL: process.env.NEXT_PUBLIC_DEMO_URL,
    NEXT_PUBLIC_STAGING_URL: process.env.NEXT_PUBLIC_STAGING_URL,

    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_SENTRY_DISABLED: process.env.NEXT_PUBLIC_SENTRY_DISABLED,

    NEXT_PUBLIC_ENCRYPTION_KEY: process.env.NEXT_PUBLIC_ENCRYPTION_KEY,
    NEXT_PUBLIC_ENCRYPTION_SALT: process.env.NEXT_PUBLIC_ENCRYPTION_SALT,

    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
});
