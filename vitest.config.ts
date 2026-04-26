import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "server-only": "/Users/kk-mac/prologue/vitest.server-only-stub.ts",
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
    reporters: [
      'default',
      ['tdd-guard-vitest', { projectRoot: process.cwd() }],
    ],
  },
})
