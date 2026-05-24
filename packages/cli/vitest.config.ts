import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['node_modules', 'dist', 'assets'],
    environment: 'node',
    pool: 'forks',
    coverage: {
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/cli.ts', 'src/dashboard/routes/**'],
      reporter: ['text', 'html'],
    },
  },
});
