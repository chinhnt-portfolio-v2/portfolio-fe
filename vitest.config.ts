import path from 'path'

import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    typecheck: {
      tsconfig: './tsconfig.test.json',
    },
    coverage: {
      provider: 'v8',
      thresholds: {
        functions: 60,
        lines: 60,
        branches: 60,
        statements: 60,
      },
      include: ['src/lib/**/*.ts', 'src/hooks/**/*.ts', 'src/stores/**/*.ts'],
      exclude: ['**/.gitkeep'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
