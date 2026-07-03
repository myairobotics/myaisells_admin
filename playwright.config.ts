import { defineConfig, devices } from '@playwright/test';
import { Env } from './src/libs/Env';

// Use Env.PORT by default and fallback to port 3000
const PORT = Env.PORT || 3000;

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  // Look for files with the .spec.js or .e2e.js extension
  testMatch: '*.@(spec|e2e).?(c|m)[jt]s?(x)',
  timeout: Env.CI ? 30 * 1000 : 60 * 1000,
  // Fail the build on CI if you accidentally left test.only in the source code.
  forbidOnly: !!Env.CI,
  // Reporter to use. See https://playwright.dev/docs/test-reporters
  reporter: Env.CI ? 'github' : 'list',

  expect: {
    // Set timeout for async expect matchers
    timeout: 20 * 1000,
  },

  // Run your local dev server before starting the tests:
  // https://playwright.dev/docs/test-advanced#launching-a-development-web-server-during-the-tests
  webServer: {
    command: Env.CI ? 'npm run start' : 'npm run dev',
    url: baseURL,
    timeout: 2 * 60 * 1000,
    reuseExistingServer: !Env.CI,
    env: {
      NEXT_PUBLIC_SENTRY_DISABLED: 'true',
    },
  },

  // Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions.
  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer
    trace: Env.CI ? 'on' : 'retain-on-failure',

    // Record videos when retrying the failed test.
    video: Env.CI ? 'retain-on-failure' : undefined,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    ...(Env.CI
      ? [
          {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
          },
        ]
      : []),
  ],
});
