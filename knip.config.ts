import type { KnipConfig } from 'knip';

const config: KnipConfig = {
  // Unused exports/types/duplicates are dominated by RTK Query hooks and UI
  // barrel-file re-exports that are kept as an API surface ahead of every
  // consumer existing; only flag files and dependencies that have truly
  // gone dead.
  exclude: ['exports', 'types', 'duplicates'],
  // Files to exclude from Knip analysis
  ignore: [
    'src/libs/I18n.ts',
    'src/types/I18n.ts',
    'src/utils/Helpers.ts',
  ],
  // Dependencies to ignore during analysis
  ignoreDependencies: [
    // MUI's default style engine needs these at runtime even though no
    // app code imports them directly.
    '@emotion/react',
    '@emotion/styled',
    // Used by the webpack loader config in next.config.ts, which Knip
    // doesn't statically analyze.
    '@svgr/webpack',
    // Required direct deps for @sentry/nextjs instrumentation; versions
    // are pinned via pnpm.overrides in package.json.
    'import-in-the-middle',
    'require-in-the-middle',
    // Invoked via lefthook.yml, not imported from source.
    'lefthook',
    // Provides the `run-p` binary used by the dev:spotlight script.
    'npm-run-all',
    // Companion to the browser-mode "ui" Vitest project; not yet used by
    // any test file.
    'vitest-browser-react',
  ],
  compilers: {
    css: (text: string) => [...text.matchAll(/(?<=@)import[^;]+/g)].join('\n'),
  },
};

export default config;
